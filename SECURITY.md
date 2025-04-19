# Security Policy

## Threat Model
* Front‑end served from immutable IPFS hash
* All proofs generated client‑side (no backend secrets)
* Contracts are non‑upgradeable; admin keys only for fee recipient changes

## Audits
* Solidity contracts – pending external audit (recommended before mainnet)
* Circuits – peer review + 0xPARC tooling

## Responsible Disclosure
Please report vulnerabilities to **security@pr1v.xyz** with detailed PoC. Rewards via Immunefi bounty.