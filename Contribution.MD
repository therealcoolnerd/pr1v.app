Contribution Guidelines

Contributing to PR1V

We appreciate your interest in contributing to PR1V — a protocol built on privacy, purpose, and powerful code.

Before you jump in, take a minute to review the guidelines below to help us keep PR1V secure, consistent, and scalable.

How to Contribute

Fork the repo

Clone your fork:

git clone https://github.com/your-username/PR1V.git
cd PR1V

Create a new branch:

git checkout -b feat/your-feature-name

Make your changes (UI in src/, contracts in contracts/, ZK logic in circuits/)

Run tests:

npm run lint
npm test

Commit and push:

git commit -m "feat: add feature XYZ"
git push origin feat/your-feature-name

Open a pull request to main

Security Contributions

For vulnerability fixes, refer to SECURITY.md and contact us privately before creating a public issue or PR.

Code Style

camelCase for JS, snake_case for Circom

Solidity: follow the standard OpenZeppelin style guide

Include tests and comments
