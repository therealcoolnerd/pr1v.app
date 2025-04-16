# Circuits Usage

To compile the Circom circuits and generate proving/verifying keys, you can use the following steps (requires [circom](https://docs.circom.io/) and [snarkjs](https://github.com/iden3/snarkjs)):

```bash
# Navigate to the circuits directory
cd circuits

# Compile the ZkSend circuit
circom zkSend.circom --r1cs --wasm --sym -o build/

# Compile the ZkWithdraw circuit
circom zkWithdraw.circom --r1cs --wasm --sym -o build/

# Compile the WalletScrub circuit
circom walletScrub.circom --r1cs --wasm --sym -o build/

# Run Groth16 setup (example using a Powers of Tau file for 2^12 constraints)
snarkjs groth16 setup build/zkSend.r1cs pot12_final.ptau build/zkSend.zkey

# Contribute to phase 2 (optional)
snarkjs zkey contribute build/zkSend.zkey build/zkSend_final.zkey --name="Setup"

# Export verification key (to use in verifier contract)
snarkjs zkey export verificationkey build/zkSend_final.zkey build/zkSend.vkey.json

# (Repeat setup for other circuits as needed)
```

After generating the .zkey files, you can also export a Solidity verifier contract (e.g. for ZkSend):

```bash
snarkjs zkey export solidityverifier build/zkSend_final.zkey ../contracts/Verifier.sol
```

This will produce a Verifier.sol contract that can be used in the smart contracts (replacing the stub if needed). You can then generate proofs. For example, to generate a proof for ZkSend:

```bash
# Create a witness
node build/zkSend_js/generate_witness.js build/zkSend_js/zkSend.wasm input.json witness.wtns

# Generate a proof
snarkjs groth16 prove build/zkSend_final.zkey witness.wtns proof.json public.json

# Verify the proof
snarkjs groth16 verify build/zkSend.vkey.json public.json proof.json
```
