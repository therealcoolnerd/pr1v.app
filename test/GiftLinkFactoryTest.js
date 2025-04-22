// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/GiftLinkFactory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract GiftLinkFactoryTest {
    GiftLinkFactory public giftLinkFactory;
    MockERC20 public mockToken;
    address public feeRecipient = 0x52b1b0673b856B214d7fE4846cf9509Ef7F0d74D;
    uint256 public fee = 0.01 ether;
    
    constructor() {
        giftLinkFactory = new GiftLinkFactory(fee, feeRecipient);
        mockToken = new MockERC20("Mock Token", "MOCK");
    }
    
    function testCreateEthGiftLink() public {
        // Create a secret and hash
        bytes32 secret = bytes32(uint256(1));
        bytes32 secretHash = keccak256(abi.encodePacked(secret));
        
        // Get initial balances
        uint256 initialContractBalance = address(giftLinkFactory).balance;
        uint256 initialFeeRecipientBalance = feeRecipient.balance;
        
        // Create gift link with ETH
        uint256 giftAmount = 0.5 ether;
        uint256 expiryTime = block.timestamp + 86400; // 24 hours from now
        giftLinkFactory.createGiftLink{value: fee + giftAmount}(address(0), giftAmount, secretHash, expiryTime);
        
        // Check that gift link was created
        (address creator, address token, uint256 amount, uint256 expiry, bool claimed) = giftLinkFactory.giftLinks(secretHash);
        
        assert(creator == address(this));
        assert(token == address(0));
        assert(amount == giftAmount);
        assert(expiry == expiryTime);
        assert(!claimed);
        
        // Check that ETH was deposited
        uint256 finalContractBalance = address(giftLinkFactory).balance;
        assert(finalContractBalance == initialContractBalance + giftAmount);
        
        // Check that fee was paid
        uint256 finalFeeRecipientBalance = feeRecipient.balance;
        assert(finalFeeRecipientBalance == initialFeeRecipientBalance + fee);
        
        console.log("GiftLinkFactory.createGiftLink (ETH) test passed");
    }
    
    function testCreateTokenGiftLink() public {
        // Create a secret and hash
        bytes32 secret = bytes32(uint256(2));
        bytes32 secretHash = keccak256(abi.encodePacked(secret));
        
        // Approve tokens for gift
        uint256 giftAmount = 100 * 10**18;
        mockToken.approve(address(giftLinkFactory), giftAmount);
        
        // Get initial balances
        uint256 initialContractBalance = mockToken.balanceOf(address(giftLinkFactory));
        uint256 initialFeeRecipientBalance = feeRecipient.balance;
        
        // Create gift link with tokens
        uint256 expiryTime = block.timestamp + 86400; // 24 hours from now
        giftLinkFactory.createGiftLink{value: fee}(address(mockToken), giftAmount, secretHash, expiryTime);
        
        // Check that gift link was created
        (address creator, address token, uint256 amount, uint256 expiry, bool claimed) = giftLinkFactory.giftLinks(secretHash);
        
        assert(creator == address(this));
        assert(token == address(mockToken));
        assert(amount == giftAmount);
        assert(expiry == expiryTime);
        assert(!claimed);
        
        // Check that tokens were deposited
        uint256 finalContractBalance = mockToken.balanceOf(address(giftLinkFactory));
        assert(finalContractBalance == initialContractBalance + giftAmount);
        
        // Check that fee was paid
        uint256 finalFeeRecipientBalance = feeRecipient.balance;
        assert(finalFeeRecipientBalance == initialFeeRecipientBalance + fee);
        
        console.log("GiftLinkFactory.createGiftLink (Token) test passed");
    }
    
    function testClaimGift() public {
        // Create a secret and hash
        bytes32 secret = bytes32(uint256(3));
        bytes32 secretHash = keccak256(abi.encodePacked(secret));
        
        // Create gift link with ETH
        uint256 giftAmount = 0.5 ether;
        uint256 expiryTime = block.timestamp + 86400; // 24 hours from now
        giftLinkFactory.createGiftLink{value: fee + giftAmount}(address(0), giftAmount, secretHash, expiryTime);
        
        // Get initial recipient balance
        address recipient = address(0x123);
        uint256 initialRecipientBalance = recipient.balance;
        
        // Claim gift
        giftLinkFactory.claimGift(secret, recipient);
        
        // Check that gift was claimed
        (,,,, bool claimed) = giftLinkFactory.giftLinks(secretHash);
        assert(claimed);
        
        // Check that ETH was transferred to recipient
        uint256 finalRecipientBalance = recipient.balance;
        assert(finalRecipientBalance == initialRecipientBalance + giftAmount);
        
        console.log("GiftLinkFactory.claimGift test passed");
    }
    
    function testCancelGift() public {
        // Create a secret and hash
        bytes32 secret = bytes32(uint256(4));
        bytes32 secretHash = keccak256(abi.encodePacked(secret));
        
        // Create gift link with ETH that expires immediately
        uint256 giftAmount = 0.5 ether;
        uint256 expiryTime = block.timestamp; // Expires immediately for testing
        giftLinkFactory.createGiftLink{value: fee + giftAmount}(address(0), giftAmount, secretHash, expiryTime);
        
        // Get initial creator balance
        uint256 initialCreatorBalance = address(this).balance;
        
        // Cancel gift
        giftLinkFactory.cancelGift(secretHash);
        
        // Check that gift was marked as claimed (to prevent future claims)
        (,,,, bool claimed) = giftLinkFactory.giftLinks(secretHash);
        assert(claimed);
        
        // Check that ETH was returned to creator
        uint256 finalCreatorBalance = address(this).balance;
        assert(finalCreatorBalance == initialCreatorBalance + giftAmount);
        
        console.log("GiftLinkFactory.cancelGift test passed");
    }
    
    function runTests() public {
        testCreateEthGiftLink();
        testCreateTokenGiftLink();
        testClaimGift();
        testCancelGift();
        console.log("All GiftLinkFactory tests passed");
    }
}
