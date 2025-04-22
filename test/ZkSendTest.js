// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/ZkSend.sol";
import "../contracts/Verifier.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract ZkSendTest {
    ZkSend public zkSend;
    Verifier public verifier;
    MockERC20 public mockToken;
    address public feeRecipient = 0x52b1b0673b856B214d7fE4846cf9509Ef7F0d74D;
    uint256 public fee = 0.01 ether;
    
    constructor() {
        verifier = new Verifier();
        zkSend = new ZkSend(fee, feeRecipient, address(verifier));
        mockToken = new MockERC20("Mock Token", "MOCK");
    }
    
    function testEthDeposit() public {
        // Create a commitment
        bytes32 commitment = bytes32(uint256(1));
        
        // Get initial balances
        uint256 initialContractBalance = address(zkSend).balance;
        uint256 initialFeeRecipientBalance = feeRecipient.balance;
        
        // Deposit ETH
        uint256 depositAmount = 1 ether;
        zkSend.deposit{value: fee + depositAmount}(address(0), depositAmount, commitment);
        
        // Check that commitment was stored
        assert(zkSend.commitments(commitment));
        
        // Check that ETH was deposited
        uint256 finalContractBalance = address(zkSend).balance;
        assert(finalContractBalance == initialContractBalance + depositAmount);
        
        // Check that fee was paid
        uint256 finalFeeRecipientBalance = feeRecipient.balance;
        assert(finalFeeRecipientBalance == initialFeeRecipientBalance + fee);
        
        console.log("ZkSend.deposit (ETH) test passed");
    }
    
    function testTokenDeposit() public {
        // Create a commitment
        bytes32 commitment = bytes32(uint256(2));
        
        // Approve tokens for deposit
        uint256 depositAmount = 100 * 10**18;
        mockToken.approve(address(zkSend), depositAmount);
        
        // Get initial balances
        uint256 initialContractBalance = mockToken.balanceOf(address(zkSend));
        uint256 initialFeeRecipientBalance = feeRecipient.balance;
        
        // Deposit tokens
        zkSend.deposit{value: fee}(address(mockToken), depositAmount, commitment);
        
        // Check that commitment was stored
        assert(zkSend.commitments(commitment));
        
        // Check that tokens were deposited
        uint256 finalContractBalance = mockToken.balanceOf(address(zkSend));
        assert(finalContractBalance == initialContractBalance + depositAmount);
        
        // Check that fee was paid
        uint256 finalFeeRecipientBalance = feeRecipient.balance;
        assert(finalFeeRecipientBalance == initialFeeRecipientBalance + fee);
        
        console.log("ZkSend.deposit (Token) test passed");
    }
    
    function testWithdraw() public {
        // Create a nullifier hash
        bytes32 nullifierHash = bytes32(uint256(3));
        
        // Get initial balances
        address recipient = address(0x123);
        uint256 initialRecipientBalance = recipient.balance;
        
        // Deposit ETH first
        bytes32 commitment = bytes32(uint256(4));
        uint256 withdrawAmount = 0.5 ether;
        zkSend.deposit{value: fee + withdrawAmount}(address(0), withdrawAmount, commitment);
        
        // Create a dummy proof (in a real scenario, this would be a valid ZK proof)
        bytes memory proof = new bytes(1);
        
        // Withdraw ETH
        zkSend.withdraw(proof, nullifierHash, recipient, address(0), withdrawAmount);
        
        // Check that nullifier hash was stored
        assert(zkSend.nullifierHashes(nullifierHash));
        
        // Check that ETH was withdrawn
        uint256 finalRecipientBalance = recipient.balance;
        assert(finalRecipientBalance == initialRecipientBalance + withdrawAmount);
        
        console.log("ZkSend.withdraw test passed");
    }
    
    function runTests() public {
        testEthDeposit();
        testTokenDeposit();
        testWithdraw();
        console.log("All ZkSend tests passed");
    }
}
