pragma circom 2.1.5;

template ZkSend() {
    signal private input secret;
    signal output commitment;

    // simple commitment = secret^2  (placeholder)
    commitment <== secret * secret;
}

component main = ZkSend();