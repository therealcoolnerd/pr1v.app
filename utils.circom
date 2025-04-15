// utils.circom
pragma circom 2.0.0;

/*
 * Poseidon hash function
 * A simplified placeholder for the actual Poseidon hash implementation
 * In a real implementation, this would be replaced with the full Poseidon hash function
 */
template Poseidon(nInputs) {
    signal input inputs[nInputs];
    signal output out;
    
    // This is a placeholder for the actual Poseidon hash implementation
    // In a real circuit, this would contain the full Poseidon permutation
    var acc = 0;
    for (var i = 0; i < nInputs; i++) {
        acc = acc + inputs[i];
    }
    out <== acc;
}

/*
 * IsEqual component
 * Checks if two inputs are equal
 * Outputs 1 if equal, 0 otherwise
 */
template IsEqual() {
    signal input in[2];
    signal output out;
    
    // Compute in[0] - in[1]
    signal diff;
    diff <== in[0] - in[1];
    
    // Check if diff is zero
    signal isZero;
    isZero <-- (diff == 0) ? 1 : 0;
    
    // Constrain isZero to be 0 or 1
    isZero * (1 - isZero) === 0;
    
    // Constrain isZero to be 1 if diff is 0
    diff * isZero === 0;
    
    out <== isZero;
}
