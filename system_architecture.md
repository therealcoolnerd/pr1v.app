# Pr1v.app System Architecture

## Overview

This document outlines the detailed system architecture for pr1v.app, a privacy-focused application providing wallet scrubbing, private transfers, and gift link generation for cryptocurrency users. The architecture is designed with security, privacy, and censorship resistance as primary considerations.

## System Components

### 1. Smart Contract Layer

The smart contract layer forms the foundation of pr1v.app, providing the secure, on-chain functionality for all privacy features.

#### 1.1 WalletScrubber.sol

**Purpose:** Detect and remove unwanted or potentially malicious tokens from user wallets.

**Key Functions:**
- `detectToxicTokens(address wallet)`: Scans wallet for potentially malicious tokens
- `identifyDustAttacks(address wallet)`: Identifies potential dust attack tokens
- `burnToken(address token, uint256 amount)`: Burns unwanted tokens by sending to dead address
- `generateMigrationPlan(address oldWallet)`: Creates a secure plan for migrating assets to a new wallet

**State Variables:**
- `mapping(address => bool) public knownMaliciousTokens`: Optional local cache of known malicious tokens
- `address public constant DEAD_ADDRESS`: The burn address (0x000...dead)

**Events:**
- `TokenBurned(address indexed token, uint256 amount, address indexed from)`
- `MigrationPlanGenerated(address indexed oldWallet, address indexed newWallet)`

#### 1.2 ZkSend.sol

**Purpose:** Enable private transfers using zero-knowledge proofs.

**Key Functions:**
- `deposit(address token, uint256 amount, bytes32 commitment)`: Deposits funds with a commitment
- `withdraw(bytes calldata proof, bytes32 nullifierHash, address recipient, uint256 amount)`: Withdraws funds using ZK proof
- `verifyProof(bytes calldata proof, bytes32 nullifierHash, bytes32 commitment)`: Verifies the ZK proof

**State Variables:**
- `mapping(bytes32 => bool) public commitments`: Tracks valid commitments
- `mapping(bytes32 => bool) public nullifierHashes`: Prevents double-spending
- `IVerifier public verifier`: Interface to the ZK proof verifier

**Events:**
- `Deposit(bytes32 indexed commitment, address token, uint256 amount)`
- `Withdrawal(address indexed recipient, bytes32 nullifierHash, uint256 amount)`

#### 1.3 GiftLinkFactory.sol

**Purpose:** Create and manage one-time gift links for crypto transfers.

**Key Functions:**
- `createGiftLink(address token, uint256 amount, bytes32 secretHash)`: Creates a new gift link
- `claimGift(bytes32 secret, address recipient)`: Claims a gift using the secret
- `cancelGift(bytes32 secretHash)`: Allows creator to cancel an unclaimed gift
- `setExpiryTime(bytes32 secretHash, uint256 expiryTime)`: Sets expiry for self-destructing links

**State Variables:**
- `mapping(bytes32 => GiftLink) public giftLinks`: Stores gift link data
- `struct GiftLink { address creator; address token; uint256 amount; uint256 expiryTime; bool claimed; }`

**Events:**
- `GiftLinkCreated(bytes32 indexed secretHash, address token, uint256 amount)`
- `GiftClaimed(bytes32 indexed secretHash, address indexed recipient)`
- `GiftCancelled(bytes32 indexed secretHash)`

#### 1.4 Verifier.sol

**Purpose:** Verify zero-knowledge proofs for private transactions.

**Key Functions:**
- `verifyProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input)`: Verifies ZK proof
- `verifyBatchProof(uint[2][] memory a, uint[2][2][] memory b, uint[2][] memory c, uint[2][] memory input)`: Batch verification

**Implementation Notes:**
- Generated from zkSNARK circuit compilation
- Optimized for gas efficiency
- Immutable after deployment

### 2. Frontend Layer

The frontend layer provides the user interface and client-side processing for pr1v.app.

#### 2.1 Core Components

**2.1.1 App Container**
- Entry point for the application
- Manages global state and routing
- Handles wallet connection and authentication

**2.1.2 Feature Modules**
- WalletScrubberModule: UI and logic for wallet scrubbing
- PrivateSendModule: UI and logic for private transfers
- GiftLinkModule: UI and logic for gift link generation

**2.1.3 Shared Components**
- WalletConnector: Handles wallet connection (MetaMask, WalletConnect, etc.)
- NetworkSelector: Allows users to switch between supported networks
- FeeCalculator: Calculates and displays fees for operations
- TransactionMonitor: Tracks transaction status and confirmations

#### 2.2 Technical Implementation

**Framework:** Next.js
- Server-side rendering for improved performance
- API routes for backend functionality (when needed)
- Static generation for censorship resistance

**State Management:**
- React Context API for global state
- React Query for blockchain data fetching and caching

**Styling:**
- TailwindCSS for responsive design
- Dark/light mode support
- Mobile-first approach

**Blockchain Interaction:**
- ethers.js for Ethereum interaction
- Wagmi hooks for simplified blockchain state management
- RainbowKit for wallet connection UI

### 3. Zero-Knowledge Layer

The zero-knowledge layer handles the generation and verification of ZK proofs for private transactions.

#### 3.1 Circuit Design

**3.1.1 Deposit Circuit**
- Inputs: token, amount, recipient (private), nullifier (private)
- Outputs: commitment
- Constraints: Ensures commitment is correctly formed

**3.1.2 Withdrawal Circuit**
- Inputs: nullifier (private), recipient, amount, commitment
- Outputs: nullifierHash, proof
- Constraints: Verifies ownership and prevents double-spending

#### 3.2 Implementation Technologies

**Circuit Development:**
- Circom for circuit definition
- SnarkJS for proof generation and verification
- Groth16 proving system for efficiency

**Client-side Processing:**
- WebAssembly for browser-based proof generation
- Web Workers for non-blocking UI during computation
- IndexedDB for secure, client-side storage of intermediate values

## Data Flow

### 1. Wallet Scrubbing Flow

1. User connects wallet to pr1v.app
2. Frontend requests token balances and transaction history
3. Client-side analysis identifies potential issues
4. User selects tokens to burn or migrate
5. Smart contract executes the requested operations
6. Frontend displays confirmation and updated wallet state

### 2. Private Send Flow

1. User inputs recipient address and amount
2. Client generates random nullifier and calculates commitment
3. User approves deposit transaction
4. After confirmation, client generates ZK proof
5. User approves withdrawal transaction with proof
6. Smart contract verifies proof and transfers funds
7. Frontend displays confirmation of private transfer

### 3. Gift Link Flow

1. User selects token and amount for gift
2. Client generates random secret and calculates hash
3. User approves gift creation transaction
4. Frontend generates shareable link with encrypted secret
5. Recipient opens link and connects wallet
6. Client decrypts secret and submits claim transaction
7. Smart contract verifies secret and transfers funds
8. Frontend displays confirmation of successful claim

## Security Implementation

### 1. Smart Contract Security

**1.1 Access Control**
- OpenZeppelin's Ownable for admin functions (minimal)
- Function-level access control for sensitive operations
- Time-locks for critical parameter changes

**1.2 Reentrancy Protection**
- OpenZeppelin's ReentrancyGuard for all external functions
- Check-Effects-Interactions pattern throughout
- Minimal external calls to reduce attack surface

**1.3 Overflow/Underflow Protection**
- Solidity 0.8.x built-in overflow/underflow checks
- SafeMath for any custom mathematical operations
- Explicit bounds checking for critical values

### 2. Frontend Security

**2.1 Client-side Encryption**
- AES-256 for symmetric encryption
- ECDH for key exchange
- Argon2id for key derivation from passwords

**2.2 Data Protection**
- No server-side storage of sensitive data
- LocalStorage/IndexedDB encryption for persistent data
- Memory clearing after sensitive operations

**2.3 Input Validation**
- Comprehensive client-side validation
- Server-side validation for any API endpoints
- Sanitization of all user inputs

### 3. Network Security

**3.1 Communication Security**
- HTTPS for all web traffic
- WebSockets with TLS for real-time updates
- Content Security Policy to prevent XSS

**3.2 API Security**
- Rate limiting for public endpoints
- CORS restrictions
- API key validation for sensitive operations

## Deployment Architecture

### 1. Smart Contract Deployment

**1.1 Deployment Process**
- Testnet deployment and testing
- Security audit
- Mainnet deployment with verified source code
- No admin keys or upgrade mechanisms

**1.2 Network Support**
- Ethereum Mainnet (primary)
- Base (L2)
- Polygon zkEVM (L2)
- Arbitrum (L2)

### 2. Frontend Deployment

**2.1 Primary Hosting**
- Vercel/Netlify for primary hosting
- Cloudflare for DDoS protection
- Multiple geographic regions for performance

**2.2 Censorship-Resistant Backup**
- IPFS hosting via Fleek
- ENS domain for decentralized addressing
- Distributed gateway access

## Monitoring and Maintenance

### 1. Smart Contract Monitoring

- Tenderly for real-time contract monitoring
- Automated alerts for unusual activity
- Regular security reviews

### 2. Frontend Monitoring

- Error tracking with Sentry (self-hosted)
- Performance monitoring with Lighthouse
- User feedback collection (anonymous)

### 3. Incident Response

- Documented incident response procedures
- Bug bounty program
- Responsible disclosure policy

## Conclusion

The pr1v.app system architecture is designed to provide a secure, private, and censorship-resistant platform for cryptocurrency users. By leveraging zero-knowledge proofs, client-side encryption, and decentralized technologies, pr1v.app aims to set a new standard for on-chain privacy tools.
