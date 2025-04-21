# PR1V App

PR1V is a privacy toolkit for cryptocurrency assets, offering features to enhance privacy and security in blockchain transactions.

## Features

### 1. Wallet Scrubber
Clean your wallet from toxic or blacklisted tokens. Burn unwanted tokens or generate a migration plan to a new wallet.

### 2. Private Send (ZK Transfers)
Send crypto privately using zero-knowledge proofs. Your transaction details remain confidential.

### 3. Gift Link Generator
Create shareable links for anonymous crypto transfers. Perfect for gifts, donations, or payments.

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MetaMask or another Ethereum wallet

### Installation

1. Clone the repository
```bash
git clone https://github.com/therealcoolnerd/pr1v.app.git
cd pr1v.app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src`: Frontend React application
  - `/components`: UI components for the three core features
  - `App.jsx`: Main application component
  - `WalletContext.jsx`: Context for wallet connection

- `/contracts`: Smart contracts
  - `WalletScrubber.sol`: For detecting and removing unwanted tokens
  - `ZkSend.sol`: For private transfers using zero-knowledge proofs
  - `GiftLinkFactory.sol`: For creating and managing one-time gift links
  - `Verifier.sol`: For verifying zero-knowledge proofs

- `/circuits`: Zero-knowledge circuits
  - `zkSend.circom`: For creating commitments during deposits
  - `zkWithdraw.circom`: For proving ownership during withdrawals
  - `walletScrub.circom`: For wallet scrubbing operations

- `/test`: Test files for smart contracts and frontend

## Building and Deployment

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Security

Please see [SECURITY.md](SECURITY.md) for security policies and procedures.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
