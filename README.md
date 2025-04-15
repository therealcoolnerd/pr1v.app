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
