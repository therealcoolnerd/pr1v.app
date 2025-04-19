## Build configuration

This bundle drops the complete JS/TS tooling:

* **Vite** – dev server & production build
* **TailwindCSS** – utility‑first styling
* **ESLint/Prettier** – lint + format
* **Hardhat toolbox** – Solidity compile/test
* Unified npm scripts: `dev`, `build`, `preview`, `test`, `lint`, `format`

After pushing:

```bash
npm install
npm run dev
```

You should see the blank Vite + React landing page at http://localhost:5173