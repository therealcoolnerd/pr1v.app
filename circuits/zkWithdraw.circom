pragma circom 2.1.5;

template ZkWithdraw() {
    signal private input secret;
    signal input commitment;
    signal output nullifier;

    commitment === secret * secret;
    nullifier <== secret + 1;
}

component main = ZkWithdraw();