import express from 'express';
import { ethers } from 'ethers';
import PairABI from '../src/contracts/CAMMPair.json' assert { type: 'json' };
import config from './config.local.json' assert { type: 'json' };
import { createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk/node';

const router = express.Router();

const RPC_URL = config.RPC_URL;
const SCANNER_PK = config.SCANNER_PK;
const ZERO_HANDLE = ethers.ZeroHash;

// Boot logs (mask secrets)
console.log('[BOOT] RPC_URL:', RPC_URL ? RPC_URL.slice(0, 48) + '…' : 'MISSING');
console.log('[BOOT] SCANNER_PK:', SCANNER_PK ? '***' + SCANNER_PK.slice(-6) : 'MISSING');

let lastReservesCache = {};
let instance;
try {
  instance = await createInstance(SepoliaConfig);
  console.log('[BOOT] relayer-sdk instance created');
} catch (e) {
  console.error('[BOOT ERROR] createInstance failed:', e);
}

// Small helper to stringify errors robustly
const errStr = (e) => (e?.stack || e?.message || String(e));

async function getPriceApprox(pairAddress) {
  const now = Date.now();

  if (
    lastReservesCache[pairAddress] &&
    now - lastReservesCache[pairAddress].timestamp < 60_000
  ) {
    console.log(`[API] cache-hit for ${pairAddress}`);
    return lastReservesCache[pairAddress].data;
  }

  console.log(`[API] fetching price for ${pairAddress}`);
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const scannerWallet = new ethers.Wallet(SCANNER_PK, provider);
  console.log('[API] provider+wallet ready; scanner:', scannerWallet.address);

  const pair = new ethers.Contract(pairAddress, PairABI.abi, scannerWallet);

  const reserves = await pair.obfuscatedReserves();
  const obfuscatedReserve0 = reserves.obfuscatedReserve0;
  const obfuscatedReserve1 = reserves.obfuscatedReserve1;
  console.log('[API] obfuscated handles:', {
    r0: String(obfuscatedReserve0),
    r1: String(obfuscatedReserve1),
  });

  const currentHandles = {
    reserve0: String(obfuscatedReserve0),
    reserve1: String(obfuscatedReserve1),
  };

  if (
    lastReservesCache[pairAddress]?.handles &&
    lastReservesCache[pairAddress].handles.reserve0 === currentHandles.reserve0 &&
    lastReservesCache[pairAddress].handles.reserve1 === currentHandles.reserve1
  ) {
    console.log(`[API] handles unchanged for ${pairAddress} -> cache-hit`);
    return lastReservesCache[pairAddress].data;
  }

  const handleContractPairs = [];
  if (obfuscatedReserve0 !== ZERO_HANDLE) {
    handleContractPairs.push({ handle: obfuscatedReserve0, contractAddress: pairAddress });
  } else {
    console.log('[API] reserve0 is ZERO_HANDLE — using 0');
  }
  if (obfuscatedReserve1 !== ZERO_HANDLE) {
    handleContractPairs.push({ handle: obfuscatedReserve1, contractAddress: pairAddress });
  } else {
    console.log('[API] reserve1 is ZERO_HANDLE — using 0');
  }

  console.log('[API] to-decrypt count:', handleContractPairs.length);

  let decResult = {};
  if (handleContractPairs.length > 0) {
    if (!instance) throw new Error('Relayer instance not initialized');
    const keypair = instance.generateKeypair();
    const startTimeStamp = Math.floor(Date.now() / 1000).toString();
    const durationDays = '10';
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

    console.log('[API] signed; calling userDecrypt…');
    decResult = await instance.userDecrypt(
      handleContractPairs,
      keypair.privateKey,
      keypair.publicKey,
      signature.replace('0x', ''),
      contractAddresses,
      scannerWallet.address,
      startTimeStamp,
      durationDays
    );
    console.log('[API] userDecrypt keys:', Object.keys(decResult).length);
  }

  const decrypted0 = obfuscatedReserve0 === ZERO_HANDLE ? 0n : BigInt(decResult[obfuscatedReserve0] ?? 0);
  const decrypted1 = obfuscatedReserve1 === ZERO_HANDLE ? 0n : BigInt(decResult[obfuscatedReserve1] ?? 0);
  console.log('[API] decrypted:', { r0: decrypted0.toString(), r1: decrypted1.toString() });

  let price01 = null, price10 = null;
  const n0 = Number(decrypted0), n1 = Number(decrypted1);
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

  lastReservesCache[pairAddress] = { timestamp: now, handles: currentHandles, data: result };
  return result;
}

// NOTE: no /api prefix here; we mounted at /api in index.js
router.get('/price-approx', async (req, res) => {
  console.log(`[API] GET /price-approx pair=${req.query.pair}`);
  const pair = req.query.pair;
  if (!pair) return res.status(400).json({ error: 'Missing pair address' });
  try {
    const result = await getPriceApprox(pair);
    res.json(result);
  } catch (e) {
    console.error('[API ERROR]', errStr(e));
    res.status(500).json({ error: errStr(e) });
  }
});

export default router;
