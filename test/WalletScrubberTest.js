// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/WalletScrubber.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract WalletScrubberTest {
    WalletScrubber public walletScrubber;
    MockERC20 public mockToken;
    address public feeRecipient = 0x52b1b0673b856B214d7fE4846cf9509Ef7F0d74D;
    uint256 public fee = 0.01 ether;
    
    constructor() {
        walletScrubber = new WalletScrubber(fee, feeRecipient);
        mockToken = new MockERC20("Mock Token", "MOCK");
    }
    
    function testBurnToken() public {
        // Approve tokens for burning
        uint256 burnAmount = 100 * 10**18;
        mockToken.approve(address(walletScrubber), burnAmount);
        
        // Get initial balances
        uint256 initialDeadBalance = mockToken.balanceOf(walletScrubber.DEAD_ADDRESS());
        uint256 initialFeeRecipientBalance = feeRecipient.balance;
        
        // Burn tokens
        walletScrubber.burnToken{value: fee}(address(mockToken), burnAmount);
        
        // Check that tokens were burned
        uint256 finalDeadBalance = mockToken.balanceOf(walletScrubber.DEAD_ADDRESS());
        assert(finalDeadBalance == initialDeadBalance + burnAmount);
        
        // Check that fee was paid
        uint256 finalFeeRecipientBalance = feeRecipient.balance;
        assert(finalFeeRecipientBalance == initialFeeRecipientBalance + fee);
        
        console.log("WalletScrubber.burnToken test passed");
    }
    
    function testMigrationPlan() public {
        // Get initial fee recipient balance
        uint256 initialFeeRecipientBalance = feeRecipient.balance;
        
        // Generate migration plan
        address newWallet = address(0x123);
        bool success = walletScrubber.generateMigrationPlan{value: fee}(newWallet);
        
        // Check that plan was generated successfully
        assert(success);
        
        // Check that fee was paid
        uint256 finalFeeRecipientBalance = feeRecipient.balance;
        assert(finalFeeRecipientBalance == initialFeeRecipientBalance + fee);
        
        console.log("WalletScrubber.generateMigrationPlan test passed");
    }
    
    function runTests() public {
        testBurnToken();
        testMigrationPlan();
        console.log("All WalletScrubber tests passed");
    }
}
