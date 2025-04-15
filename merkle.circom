// merkle.circom
pragma circom 2.0.0;

include "./utils.circom";

/*
 * MerkleProof component
 * Verifies a Merkle proof for a leaf in a Merkle tree
 * 
 * Inputs:
 * - leaf: The leaf value to verify
 * - pathIndices: Array of 0/1 values indicating whether to use the left or right sibling at each level
 * - siblings: Array of sibling values along the path
 * - root: The Merkle root to verify against
 * 
 * Outputs:
 * - isValid: 1 if the proof is valid, 0 otherwise
 */
template MerkleProof(levels) {
    signal input leaf;
    signal input pathIndices[levels];
    signal input siblings[levels];
    signal input root;
    
    signal output isValid;
    
    // Compute the path from leaf to root
    signal computedPath[levels + 1];
    computedPath[0] <== leaf;
    
    // For each level, compute the parent hash
    for (var i = 0; i < levels; i++) {
        // Determine left and right inputs based on pathIndex
        signal left;
        signal right;
        
        // If pathIndex is 0, leaf is on the left
        // If pathIndex is 1, leaf is on the right
        left <-- pathIndices[i] == 0 ? computedPath[i] : siblings[i];
        right <-- pathIndices[i] == 1 ? computedPath[i] : siblings[i];
        
        // Constrain pathIndices to be 0 or 1
        pathIndices[i] * (1 - pathIndices[i]) === 0;
        
        // Hash the left and right values to get the parent
        component hasher = Poseidon(2);
        hasher.inputs[0] <== left;
        hasher.inputs[1] <== right;
        
        // Set the computed path for the next level
        computedPath[i + 1] <== hasher.out;
    }
    
    // Check if the computed root matches the expected root
    component rootCheck = IsEqual();
    rootCheck.in[0] <== computedPath[levels];
    rootCheck.in[1] <== root;
    
    isValid <== rootCheck.out;
}

component main {public [root]} = MerkleProof(20);
