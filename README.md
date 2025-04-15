# 🕶️ PR1V

**Let privacy be the protocol.**

PR1V is a decentralized, privacy-first crypto toolkit built to help users take back control of their on-chain identity. With tools like wallet scrubbing, zkSNARK-powered private sends, and encrypted gift links, PR1V empowers users to transact stealthily, securely, and freely across EVM-compatible chains.

---

## 🔒 Features

- **Wallet Scrubber**  
  Clean your wallet from dust attacks, blacklisted tokens, or unwanted airdrops. Burn 'em or move safely.

- **Private Send (zkSNARKs)**  
  Send ETH or tokens without leaving an on-chain trail using zero-knowledge proofs.

- **Gift Links**  
  Send crypto with stealth — generate claimable links or QR codes for anonymous transfers.

- **Multichain Ready**  
  Built for Ethereum, Base, Polygon zkEVM, Arbitrum, and more. Solana and Bitcoin coming soon.

- **No Tracking. No Custody. No Compromises.**  
  Fully open-source, IPFS-hosted frontend, and smart contract-controlled logic.

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-org/pr1v.git
cd pr1v
npm install
npm run dev


# Zero-Knowledge Circuits for Pr1v.app

This directory contains the zero-knowledge circuits used for the Private Send feature of Pr1v.app.

## Circuit Structure

The circuits are designed to enable private transfers with the following properties:
- Sender anonymity
- Amount privacy
- Recipient privacy
- Prevention of double-spending

## Implementation

We use Circom for circuit definition and SnarkJS for proof generation and verification. The circuits implement the following functionality:

1. **Deposit Circuit**: Creates a commitment from a secret nullifier and recipient information
2. **Withdrawal Circuit**: Proves knowledge of a nullifier corresponding to a commitment without revealing the link

## Circuit Files

- `deposit.circom`: Circuit for creating a commitment during deposit
- `withdraw.circom`: Circuit for proving ownership during withdrawal
- `merkle.circom`: Helper circuit for Merkle tree verification
- `utils.circom`: Utility functions and components

## Development Status

- [ ] Circuit design and implementation
- [ ] Circuit compilation and testing
- [ ] Integration with smart contracts
- [ ] Client-side proof generation

## Usage

Instructions for compiling and using these circuits will be added as development progresses.

🧠 Tech Stack
Frontend: React, TailwindCSS, Wagmi, RainbowKit

Smart Contracts: Solidity (Hardhat), zkSNARKs (Circom + SnarkJS)

Storage: IPFS (Web3.storage, Fleek)

Deployment: Vercel / IPFS PWA

📄 Docs
Whitepaper

Security Policy

Contributing

Code of Conduct

💬 Community
Platform	Link
Coming soon
X / Twitter	@pr1v_app
Discord	Coming soon
Website	https://pr1v.app
GitHub Discussions	Enabled in this repo

🛡️ License
MIT — open-source forever. Respect the mission. Don’t use this tech for surveillance, exploitation, or harm.

🧠 Credits
Built by devs who believe privacy is a right, not a privilege.
Inspired by Tornado Cash. Evolved for today.
Let privacy be the protocol.
