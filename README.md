# PR1V – Privacy‑First Web3 Toolkit

PR1V lets anyone **scrub wallets**, **send shielded gifts**, and **transfer value privately** via Groth16 ZK proofs.

## Quick Start
```bash
git clone <your fork>
cd pr1v.app
npm install            # deps
npm run dev            # Vite dev server http://localhost:5173

# Solidity
npx hardhat compile
npx hardhat test
```

### Deployment TL;DR
```bash
# circuits – one‑time
npm run circuits:build

# Sepolia deploy
npx hardhat run scripts/deploy.js --network sepolia
```

Live frontend is auto‑published to IPFS via GitHub Actions on every push to **main**.