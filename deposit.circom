// deposit.circom
pragma circom 2.0.0;

include "./utils.circom";

/*
 * Deposit circuit for Pr1v.app Private Send feature
 * Inputs:
 * - nullifier: Private random value known only to the depositor
 * - recipient: Private address of the recipient
 * - amount: Amount being deposited
 * - nonce: Random value to prevent collisions
 * 
 * Outputs:
 * - commitment: Public commitment that will be stored on-chain
 */
template Deposit() {
    // Private inputs
    signal input nullifier;
    signal input recipient;
    signal input amount;
    signal input nonce;
    
    // Public outputs
    signal output commitment;
    
    // Calculate commitment = Hash(nullifier, recipient, amount, nonce)
    component hasher = Poseidon(4);
    hasher.inputs[0] <== nullifier;
    hasher.inputs[1] <== recipient;
    hasher.inputs[2] <== amount;
    hasher.inputs[3] <== nonce;
    
    commitment <== hasher.out;
}

component main {public [amount]} = Deposit();
