## Circuits toolkit

Requirements:
```
npm i -g snarkjs
brew install circom   # or cargo install --path circom
```

### Quick build
```
npm run circuits:build
```
This compiles `.circom` ➜ `.r1cs` + WebAssembly and generates Groth16 `.zkey` files
into `circuits/build/`. It also exports Solidity verifier contracts that can
replace the stub `Verifier.sol` later.