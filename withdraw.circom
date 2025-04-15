// withdraw.circom
pragma circom 2.0.0;

include "./utils.circom";

/*
 * Withdrawal circuit for Pr1v.app Private Send feature
 * Inputs:
 * - nullifier: Private random value known only to the depositor
 * - recipient: Private address of the recipient
 * - amount: Amount being withdrawn
 * - nonce: Random value used in the commitment
 * - commitment: The commitment that was published during deposit
 * 
 * Outputs:
 * - nullifierHash: Public value to prevent double-spending
 * - validWithdrawal: Boolean indicating if the withdrawal is valid
 */
template Withdraw() {
    // Private inputs
    signal input nullifier;
    signal input recipient;
    signal input amount;
    signal input nonce;
    
    // Public inputs
    signal input commitment;
    
    // Public outputs
    signal output nullifierHash;
    signal output validWithdrawal;
    
    // Calculate commitment from inputs
    component hasher = Poseidon(4);
    hasher.inputs[0] <== nullifier;
    hasher.inputs[1] <== recipient;
    hasher.inputs[2] <== amount;
    hasher.inputs[3] <== nonce;
    
    // Verify that calculated commitment matches the input commitment
    component commitmentCheck = IsEqual();
    commitmentCheck.in[0] <== hasher.out;
    commitmentCheck.in[1] <== commitment;
    
    // Calculate nullifier hash to prevent double-spending
    component nullifierHasher = Poseidon(1);
    nullifierHasher.inputs[0] <== nullifier;
    nullifierHash <== nullifierHasher.out;
    
    // Output 1 if the withdrawal is valid, 0 otherwise
    validWithdrawal <== commitmentCheck.out;
}

component main {public [commitment]} = Withdraw();
