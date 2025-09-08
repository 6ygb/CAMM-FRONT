import express from 'express'
import { ethers } from 'ethers'
import PairABI from '../src/contracts/CAMMPair.json' assert { type: 'json' }
import config from './config.local.json' assert { type: 'json' }
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk/node";

const router = express.Router()

const RPC_URL = config.RPC_URL;
const SCANNER_PK = config.SCANNER_PK ;
const ZERO_HANDLE = ethers.ZeroHash;

// Rate limit state
let lastReservesCache = {}
const instance = await createInstance(SepoliaConfig);

async function getPriceApprox(pairAddress) {
    const now = Date.now()
    // Use cache if called less than 1 minute ago for this pair
    if (
        lastReservesCache[pairAddress] &&
        now - lastReservesCache[pairAddress].timestamp < 60000
    ) {
        console.log(`[API] Returning cached reserves for pair: ${pairAddress}`)
        return lastReservesCache[pairAddress].data
    }

    console.log(`Fetching price approximation for pair: ${pairAddress}`)
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const scannerWallet = new ethers.Wallet(SCANNER_PK, provider);
    const pair = new ethers.Contract(pairAddress, PairABI.abi, scannerWallet)

    // Directly read obfuscated reserves from contract storage
    const reserves = await pair.obfuscatedReserves()
    const obfuscatedReserve0 = reserves.obfuscatedReserve0
    const obfuscatedReserve1 = reserves.obfuscatedReserve1

    console.log(`Obfuscated reserves for pair ${pairAddress}:`, obfuscatedReserve0.toString(), obfuscatedReserve1.toString())

    // Check if handles are the same as cached ones to avoid unnecessary decryption
    const currentHandles = {
        reserve0: obfuscatedReserve0.toString(),
        reserve1: obfuscatedReserve1.toString()
    }

    if (
        lastReservesCache[pairAddress] &&
        lastReservesCache[pairAddress].handles &&
        lastReservesCache[pairAddress].handles.reserve0 === currentHandles.reserve0 &&
        lastReservesCache[pairAddress].handles.reserve1 === currentHandles.reserve1
    ) {
        console.log(`[API] Handles unchanged for pair ${pairAddress}, returning cached data`)
        return lastReservesCache[pairAddress].data
    }

    // SAFETY GUARD: build decrypt list only for non-zero handles
    const handleContractPairs = [];
    if (obfuscatedReserve0 !== ZERO_HANDLE) {
        handleContractPairs.push({ handle: obfuscatedReserve0, contractAddress: pairAddress });
    } else {
        console.log(`[API] Reserve0 handle is ZERO for pair ${pairAddress} — will return 0 without decrypt`);
    }
    if (obfuscatedReserve1 !== ZERO_HANDLE) {
        handleContractPairs.push({ handle: obfuscatedReserve1, contractAddress: pairAddress });
    } else {
        console.log(`[API] Reserve1 handle is ZERO for pair ${pairAddress} — will return 0 without decrypt`);
    }

    console.log(handleContractPairs.length, "handles to decrypt");
    console.log(handleContractPairs);
    let decResult = {};
    if (handleContractPairs.length > 0) {
        const keypair = instance.generateKeypair();
        const startTimeStamp = Math.floor(Date.now() / 1000).toString();
        const durationDays = "10";
        const contractAddresses = [pairAddress];

        const eip712 = instance.createEIP712(
            keypair.publicKey,
            contractAddresses,
            startTimeStamp,
            durationDays
        );

        const signature = await scannerWallet.signTypedData(
            eip712.domain,
            { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
            eip712.message
        );

        console.log("[API] Message signed, waiting for decryption");
        decResult = await instance.userDecrypt(
            handleContractPairs,
            keypair.privateKey,
            keypair.publicKey,
            signature.replace("0x", ""),
            contractAddresses,
            scannerWallet.address,
            startTimeStamp,
            durationDays,
        );
    }

    // Map decrypted or zero per guard
    const decrypted0 =
        obfuscatedReserve0 === ZERO_HANDLE ? 0n : BigInt(decResult[obfuscatedReserve0] ?? 0);
    const decrypted1 =
        obfuscatedReserve1 === ZERO_HANDLE ? 0n : BigInt(decResult[obfuscatedReserve1] ?? 0);

    console.log("[API] Decrypted reserves (with zero-guard):", decrypted0, decrypted1);

    // Only compute price if both strictly > 0 and finite
    let price01 = null
    let price10 = null;
    const n0 = Number(decrypted0);
    const n1 = Number(decrypted1);
    if (Number.isFinite(n0) && Number.isFinite(n1) && n0 > 0 && n1 > 0) {
        price01 = (n1 / n0).toFixed(6);
        price10 = (n0 / n1).toFixed(6);
    }

    const result = {
        decryptedReserve0: decrypted0.toString(),
        decryptedReserve1: decrypted1.toString(),
        priceToken0Token1: price01,
        priceToken1Token0: price10,
    };

    // Update cache
    lastReservesCache[pairAddress] = {
        timestamp: now,
        handles: currentHandles,
        data: result,
    };

    return result;
}

router.get('/api/price-approx', async (req, res) => {
    console.log(`[API] /api/price-approx called with pair: ${req.query.pair}`) // <-- Add this line
    const pair = req.query.pair
    if (!pair) return res.status(400).json({ error: 'Missing pair address' })
    try {
        const result = await getPriceApprox(pair)
        res.json(result)
    } catch (e) {
        console.error("[API ERROR]", e); // full error in backend logs
        res.status(500).json({ error: e.message });
    }
})

export default router
