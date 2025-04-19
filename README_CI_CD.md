## CI/CD

* **GitHub Actions** (`.github/workflows/ci.yml`)
  * Node 18 → lint, build, hardhat compile + test
  * On main push: deploy contracts to Sepolia + publish dist/ to Fleek IPFS
* **Secrets required**
  * `PRIVATE_KEY`, `VITE_RPC_URL`, `ETHERSCAN_API_KEY`
  * `FLEEK_API_KEY`, `FLEEK_SECRET`

* **Vercel** fallback (`vercel.json`) for instant preview deploys.