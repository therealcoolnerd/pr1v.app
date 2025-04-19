#!/usr/bin/env bash
set -e
CIRCUITS=(zkSend zkWithdraw walletScrub)
BUILD_DIR=circuits/build
PTAU=pot12_final.ptau

# download ptau if not present
if [ ! -f "$PTAU" ]; then
  echo "Downloading Powers of Tau..."
  wget -qO $PTAU https://hermez.s3-eu-west-1.amazonaws.com/$PTAU
fi

for c in ${CIRCUITS[@]}; do
  echo "Compiling $c..."
  circom circuits/$c.circom --r1cs --wasm -o $BUILD_DIR
  echo "Generating zkey..."
  snarkjs groth16 setup $BUILD_DIR/$c.r1cs $PTAU $BUILD_DIR/$c.zkey
  echo "Exporting verifier..."
  snarkjs zkey export solidityverifier $BUILD_DIR/$c.zkey contracts/${c^}Verifier.sol
done

echo "Done."
