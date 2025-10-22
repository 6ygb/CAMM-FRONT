# CAMM Front-End (POC)
 
This is a **testnet proof-of-concept** - **not meant for production**.

> ⚠️ **Disclaimer**
>
> - UI & contracts are **made as a side project** it's no where near professional grade work.  
> - Performance depends on **Zama’s on-chain decryption pipeline**, CAMM is way slower than a traditional AMM.  
> - Pricing shown in the UI is **approximate** (about **±7%** by design) to preserve confidentiality.

CAMM contracts repo at https://github.com/6ygb/CAMM

---

## What’s inside

- **Vue 3 + TypeScript**  
- **ethers v6** for wallet & contract calls  
- **Zama relayer SDK** for FHE related logic.
- Contracts: **ConfidentialToken (ERC-7984)**, **CAMMPair**, **CAMMFactory**  

---

## Quick start

### Prereqs
- Node 18+ (or 20+ recommended)
- MetaMask (desktop)
- Sepolia ETH

### Install & run
```bash
# 1) install deps
npm i

# 2) start dev server
npm run dev

# 3) build for prod
npm run build
npm run preview
```

### Network config
Network settings live in `Network.json`:
```json
{
   "public" : 
        {   
            "CHAIN_NAME": "Sepolia",
            "CURRENCY_NAME": "ETH",
            "CURRENCY_SYMBOL": "ETH",
            "RPC_URL": "https://rpc.sepolia.org",
            "EXPLORER_URL": "https://sepolia.etherscan.io",
            "CHAIN_ID": 11155111
        }
}
```

Default pair & factory addresses live in `CAMM.json`:
```json
{
    "DEFAULT_PAIR_ADDRESS": "0x2ab55edf81f6c17fa1A22aF23ed38cE8cF276414",
    "DEFAULT_ORACLE_ADDRESS" : "0xa7a7AF22A88C5dc519A7811c0c5604dce692BA65",
    "FACTORY_ADDRESS": "0x15F98C153493b12D85c0F493e9E7c971203a4809",
    "BACKEND_GITHUB_URL": "https://github.com/6ygb/CAMM",
    "FRONTEND_GITHUB_URL" : "https://github.com/6ygb/CAMM-FRONT"
}
```

---

## Tabs & Features

### 1) **Pair Selection**
Pick the trading pair the whole app will use.

- **Select recommended pair**  
  Loads `DEFAULT_PAIR_ADDRESS` from `CAMM.json`, fetches token symbols, and refreshes price approximation.
  This is a USD/EUR  pair, with available airdrop for users.

- **Search by Token0 / Token1**  
  Provide two ERC-7984 token addresses. The app queries `CAMMFactory.getPair(token0, token1)`.  
  - If found: it sets the current pair and symbols.  
  - If not found: shows a helpful error.

- **Load by Pair Address**  
  Paste a pair contract address directly. The app validates it and refreshes token symbols & price.

> Tip: copyable badges at the bottom of the app always show **Token0**, **Token1**, and **Pair** addresses.

---

### 2) **Swap**
Confidential token-for-token swaps via `CAMMPair`.

- **From / To selectors**  
  Choose which side you’re swapping. The UI shows **your balances** (decrypted on request).

- **Amount & Rate**  
  Enter a **From** amount. The **To** amount and **rate** update using the approximate price.  
  - Pricing is obfuscated; the rate is intentionally **imprecise (~±7%)**.

- **Switch button**  
  Flips From/To sides and auto-recomputes the rate.

- **Swap**  
  Requires:
  - Wallet connected & on the correct network  
  - The **pair contract** set as **operator** on **both** confidential tokens  
  - A valid amount

  Under the hood the flow is:
  1. Encrypt inputs with the Zama SDK (FHEVM).
  2. Call `pair.swapTokens(...)` with encrypted amounts.
  3. Store the **decryption request ID**.
  4. Wait for the **gateway response** (a `Swap` event).
  5. (Optional) **Self-decrypt** the in/out amounts and display a summary.

- **Self decrypt price**  
  Retrieves obfuscated reserves from the pair, performs a public decryption, and recomputes the **current rate** from fresh data.

---

### 3) **Tokens**
Everything around balances, test airdrops, transfers, and operator permissions.

- **Token Balances**  
  Click **Get Balances** to confidentially query & decrypt balances for Token0/Token1.

- **Claim airdrop**  
  If the ERC-7984 token supports it, mint a test amount (typically **1,000 units**). Great for local testing.

- **Transfer tokens**  
  Confidential transfer using encrypted inputs. Requires:
  - Recipient address (`0x…`)
  - Positive amount

- **Set operator**  
  Grant an operator allowance to a contract (e.g., the **Pair** for adding/removing liquidity).  
  - This UI uses a **10-minute** operator allowance window.  
  - You can set the pair as operator for **Token0**, **Token1**, and **LP token**.

---

### 4) **AMM**
Pool state, LP management, and refunds.

- **Liquidity Pool Information**  
  - **Obfuscated reserves** (Token0/Token1): the UI requests encrypted values and performs a **user decryption**.  
  - **Your LP balance**: confidential balance check for the LP token.

- **Add Liquidity**  
  Enter Token0 & Token1 amounts and submit.  
  Requirements:
  - Wallet connected & correct network  
  - Pair is **operator** on **both** underlying tokens  
  - Positive amounts  
  Flow:
  1. Encrypt both amounts.
  2. Call `pair.addLiquidity(...)`.
  3. Store **decryption request ID** and wait for **liquidityMinted** event.

- **Remove Liquidity**  
  Enter LP token amount and submit.  
  Requirements:
  - Pair set as **operator** on the **LP token**  
  Flow mirrors Add Liquidity and waits for **liquidityBurnt**.

- **Decryption Requests (history)**  
  The app stores decryption requests locally (browser `localStorage`) with block number and request ID.  
  Use **Copy ID** to paste into **Refund Claim**.

- **Refund Claim**  
  If a request times out or fails, you can ask the pair for a refund:  
  - **Swap refund**  
  - **Add-liquidity refund**  
  - **Remove-liquidity refund**  
  Paste the **request ID** from **Decryption Requests** and submit.

---

### 5) **Launch**
Dev tools for deploying tokens and creating pairs.

- **Deploy Confidential Token (ERC-7984)**  
  Provide *Name* and *Symbol* and deploy a fresh confidential token.  
  Successful deployments are saved in **Deployed Tokens** (local history with copy buttons).

- **Create Pair (ERC-7984 tokens)**  
  Paste two token addresses (or pick from history) and create a new pair via **CAMMFactory**.  
  On success:
  - The new pair is stored in **Created Pairs** (local history).
  - The app **auto-loads** this pair (symbols & pricing refresh).

---

## Wallet & Network

- **MetaMask required**  
  If MetaMask is not detected, the UI explains how to install it.

- **Wrong network**  
  If you’re not on Sepolia testnet defined in (`Network.json`), the UI:
  - Shows **Network Details** (Name, Chain ID, RPC URL, Currency, Explorer).  
  - Offers manual steps to add the network in MetaMask.  
  - (Optional) You can wire a one-click **“Add & Switch”** action using `wallet_addEthereumChain`.

---

## Local storage keys

- `CAMM_DECRYPTION_REQUESTS` - swap/add/remove IDs & metadata  
- `CAMM_DEPLOYED_TOKENS` - your locally deployed ERC-7984 token history  
- `CAMM_CREATED_PAIRS` - your locally created pairs history

Use the **Clear All** buttons in the UI to reset these lists.

---



## License

BSD 3-Clause Clear License.
