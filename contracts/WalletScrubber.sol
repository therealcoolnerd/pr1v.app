// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title WalletScrubber
 * @dev Contract for detecting and removing unwanted or potentially malicious tokens from user wallets
 */
contract WalletScrubber is Ownable, ReentrancyGuard {
    // Constants
    address public constant DEAD_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    
    // Fee configuration
    uint256 public fee;
    address public feeRecipient;
    
    // Events
    event TokenBurned(address indexed token, uint256 amount, address indexed from);
    event MigrationPlanGenerated(address indexed oldWallet, address indexed newWallet);
    event FeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newFeeRecipient);
    
    /**
     * @dev Constructor sets initial fee and fee recipient
     * @param _fee Initial fee for using the service
     * @param _feeRecipient Address to receive fees
     */
    constructor(uint256 _fee, address _feeRecipient) {
        require(_feeRecipient != address(0), "Fee recipient cannot be zero address");
        fee = _fee;
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Burns unwanted tokens by sending to dead address
     * @param token Address of the token to burn
     * @param amount Amount of tokens to burn
     */
    function burnToken(address token, uint256 amount) external payable nonReentrant {
        require(msg.value >= fee, "Insufficient fee");
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than zero");
        
        // Transfer fee to recipient
        (bool success, ) = feeRecipient.call{value: fee}("");
        require(success, "Fee transfer failed");
        
        // Refund excess ETH if any
        uint256 excess = msg.value - fee;
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            require(refundSuccess, "Refund failed");
        }
        
        // Transfer tokens to dead address
        IERC20 tokenContract = IERC20(token);
        uint256 balanceBefore = tokenContract.balanceOf(DEAD_ADDRESS);
        
        // Transfer tokens from sender to dead address
        require(tokenContract.transferFrom(msg.sender, DEAD_ADDRESS, amount), "Token transfer failed");
        
        // Verify transfer was successful
        uint256 balanceAfter = tokenContract.balanceOf(DEAD_ADDRESS);
        require(balanceAfter >= balanceBefore + amount, "Token burn verification failed");
        
        emit TokenBurned(token, amount, msg.sender);
    }
    
    /**
     * @dev Generates a migration plan for moving assets to a new wallet
     * @param newWallet Address of the new wallet
     * @return success Whether the plan was generated successfully
     */
    function generateMigrationPlan(address newWallet) external payable nonReentrant returns (bool success) {
        require(msg.value >= fee, "Insufficient fee");
        require(newWallet != address(0), "Invalid new wallet address");
        
        // Transfer fee to recipient
        (bool feeSuccess, ) = feeRecipient.call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");
        
        // Refund excess ETH if any
        uint256 excess = msg.value - fee;
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            require(refundSuccess, "Refund failed");
        }
        
        // In a real implementation, this would analyze the wallet and generate a plan
        // For now, we just emit an event
        emit MigrationPlanGenerated(msg.sender, newWallet);
        
        return true;
    }
    
    /**
     * @dev Updates the fee for using the service
     * @param _fee New fee amount
     */
    function updateFee(uint256 _fee) external onlyOwner {
        fee = _fee;
        emit FeeUpdated(_fee);
    }
    
    /**
     * @dev Updates the fee recipient address
     * @param _feeRecipient New fee recipient address
     */
    function updateFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Fee recipient cannot be zero address");
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(_feeRecipient);
    }
    
    /**
     * @dev Fallback function to accept ETH
     */
    receive() external payable {
        // Just accept ETH
    }
}
