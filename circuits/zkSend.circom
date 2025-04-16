template ZkSend() {
    // Private input (e.g. secret)
    signal private input secret;
    // Public output commitment
    signal output commitment;
    // Compute a simple commitment = secret * secret (placeholder for actual hash)
    commitment <== secret * secret;
}

component main = ZkSend();
