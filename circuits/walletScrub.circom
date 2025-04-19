pragma circom 2.1.5;

template WalletScrub() {
    signal private input originalBalance;
    signal private input scrubAmount;
    signal output newBalance;

    newBalance <== originalBalance - scrubAmount;
    originalBalance >= scrubAmount;
}

component main = WalletScrub();