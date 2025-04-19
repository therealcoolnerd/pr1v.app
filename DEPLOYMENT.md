# Deployment Guide

## 1. Environment Variables
Copy `.env.example` ➜ `.env` and fill:

| Variable | Description |
|----------|-------------|
| `VITE_RPC_URL` | Sepolia RPC endpoint (Alchemy/Infura) |
| `PRIVATE_KEY`  | Deployer EOA private key (Sepolia) |
| `ETHERSCAN_API_KEY` | API key for contract verification |
| `FLEEK_API_KEY`/`FLEEK_SECRET` | Fleek site deploy keys |

## 2. Circuits
```bash
npm run circuits:build   # compiles Wasm + zkey + Solidity verifiers
```

## 3. Contracts
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Copy deployed addresses to `src/config/contracts.json` (or env).

## 4. Front‑End Build
```bash
npm run build   # outputs dist/
```

## 5. Publish
CI uploads `dist/` to IPFS (Fleek) and sets ENS content hash if configured.