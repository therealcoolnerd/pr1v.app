template WalletScrub() {
    // Private inputs: original and scrubbed amounts
    signal private input originalBalance;
    signal private input scrubAmount;
    // Public output: resulting balance after scrub
    signal output newBalance;
    // Ensure newBalance = originalBalance - scrubAmount
    newBalance <== originalBalance - scrubAmount;
    // Constrain no negative result (implicit since signals are unsigned)
    // Optionally, ensure scrubAmount <= originalBalance
    originalBalance >= scrubAmount;
}

component main = WalletScrub();
