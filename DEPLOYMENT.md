# Pr1v.app Deployment Guide

This guide provides instructions for deploying the pr1v.app application to Ethereum Test Net and Main Net.

## Prerequisites

Before deploying, ensure you have the following:

1. Node.js and npm installed
2. An Infura API key for accessing Ethereum networks
3. A mnemonic phrase for the deployer wallet
4. Etherscan API key for contract verification
5. Sufficient ETH in the deployer wallet for gas fees

## Environment Setup

Create a `.env` file in the project root with the following variables:

```
INFURA_API_KEY=your_infura_api_key
MNEMONIC=your_mnemonic_phrase
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Deployment Steps

### 1. Install Dependencies

```bash
cd pr1v_project
npm install
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

### 3. Deploy to Goerli Test Network

```bash
npx hardhat run scripts/deploy.js --network goerli
```

This will deploy all contracts to the Goerli test network and output the contract addresses.

### 4. Verify Contracts on Etherscan

After deployment, verify the contracts on Etherscan:

```bash
npx hardhat verify --network goerli VERIFIER_ADDRESS
npx hardhat verify --network goerli WALLET_SCRUBBER_ADDRESS "10000000000000000" "0x52b1b0673b856B214d7fE4846cf9509Ef7F0d74D"
npx hardhat verify --network goerli ZK_SEND_ADDRESS "10000000000000000" "0x52b1b0673b856B214d7fE4846cf9509Ef7F0d74D" "VERIFIER_ADDRESS"
npx hardhat verify --network goerli GIFT_LINK_FACTORY_ADDRESS "10000000000000000" "0x52b1b0673b856B214d7fE4846cf9509Ef7F0d74D"
```

Replace the addresses with the actual deployed contract addresses.

### 5. Update Frontend Configuration

Update the contract addresses in the frontend configuration:

```bash
cd frontend
```

Create or update `src/config.js` with the deployed contract addresses.

### 6. Deploy to Ethereum Main Net

Once testing is complete on Goerli, deploy to Ethereum Main Net:

```bash
npx hardhat run scripts/deploy.js --network mainnet
```

Follow the same verification steps as above, but use the `--network mainnet` flag.

## Contract Addresses

After deployment, record the contract addresses here:

### Goerli Test Net
- Verifier: [TBD]
- WalletScrubber: [TBD]
- ZkSend: [TBD]
- GiftLinkFactory: [TBD]

### Ethereum Main Net
- Verifier: [TBD]
- WalletScrubber: [TBD]
- ZkSend: [TBD]
- GiftLinkFactory: [TBD]

## Future Network Expansion

The following networks will be added in future updates:
- Base
- Polygon zkEVM
- Arbitrum

## Fee Configuration

All contracts are configured with a fee of 0.01 ETH, directed to the payout address:
`0x52b1b0673b856B214d7fE4846cf9509Ef7F0d74D`

## Maintenance and Updates

To update contract parameters (such as fees):
1. Call the appropriate update function (e.g., `updateFee`, `updateFeeRecipient`)
2. Only the contract owner can perform these operations
3. Use the Hardhat console or a tool like Remix to interact with deployed contracts
