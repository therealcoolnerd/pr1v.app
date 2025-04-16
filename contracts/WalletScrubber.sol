// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WalletScrubber {
    uint256 public fee;
    address public feeRecipient;
    // Define a constant "dead" address for burning tokens
    address public constant DEAD_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    event TokensBurned(address indexed token, address indexed sender, uint256 amount);
    event MigrationPlanGenerated(address indexed user, address indexed newWallet);

    constructor(uint256 _fee, address _feeRecipient) {
        fee = _fee;
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Burn unwanted tokens by sending them to the DEAD address.
     * @param token The ERC20 token address to burn.
     * @param amount The amount of tokens to burn.
     */
    function burnToken(address token, uint256 amount) external payable {
        require(msg.value >= fee, "Insufficient fee");
        require(token != address(0), "Token address is zero");
        // Transfer tokens from sender to DEAD address
        IERC20(token).transferFrom(msg.sender, DEAD_ADDRESS, amount);
        // Forward the fee to the fee recipient
        payable(feeRecipient).transfer(fee);
        emit TokensBurned(token, msg.sender, amount);
    }

    /**
     * @dev Generate a migration plan for moving assets to a new wallet.
     * This is a stub that currently only collects a fee.
     * @param newWallet The address of the new wallet.
     * @return success Always returns true if fee is paid.
     */
    function generateMigrationPlan(address newWallet) external payable returns (bool success) {
        require(msg.value >= fee, "Insufficient fee");
        require(newWallet != address(0), "New wallet is zero address");
        // In a real implementation, this might gather balances and prepare transactions.
        // Here we just collect the fee.
        payable(feeRecipient).transfer(fee);
        emit MigrationPlanGenerated(msg.sender, newWallet);
        return true;
    }
}
