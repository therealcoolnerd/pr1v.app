// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GiftLinkFactory
 * @dev Contract for creating and managing one-time gift links
 */
contract GiftLinkFactory is Ownable, ReentrancyGuard {
    // Struct to store gift information
    struct Gift {
        address creator;
        address token;
        uint256 amount;
        uint256 expiryTime;
        bool claimed;
    }
    
    // Mapping from secret hash to gift
    mapping(bytes32 => Gift) public gifts;
    
    // Fee configuration
    uint256 public fee;
    address public feeRecipient;
    
    // Events
    event GiftCreated(bytes32 indexed secretHash, address indexed creator, address token, uint256 amount, uint256 expiryTime);
    event GiftClaimed(bytes32 indexed secretHash, address indexed recipient);
    event GiftCancelled(bytes32 indexed secretHash, address indexed creator);
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
     * @dev Creates a new gift link
     * @param token Address of the token to gift (use address(0) for ETH)
     * @param amount Amount to gift
     * @param secretHash Hash of the secret used to claim the gift
     * @param expiryTime Timestamp when the gift expires
     */
    function createGiftLink(
        address token,
        uint256 amount,
        bytes32 secretHash,
        uint256 expiryTime
    ) external payable nonReentrant {
        require(secretHash != bytes32(0), "Invalid secret hash");
        require(gifts[secretHash].creator == address(0), "Gift with this secret hash already exists");
        require(expiryTime > block.timestamp, "Expiry time must be in the future");
        require(msg.value >= fee, "Insufficient fee");
        
        // Transfer fee to recipient
        (bool feeSuccess, ) = feeRecipient.call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");
        
        // Handle gift creation
        if (token == address(0)) {
            // ETH gift
            require(msg.value >= fee + amount, "Insufficient ETH sent");
            
            // Refund excess ETH if any
            uint256 excess = msg.value - fee - amount;
            if (excess > 0) {
                (bool refundSuccess, ) = msg.sender.call{value: excess}("");
                require(refundSuccess, "Refund failed");
            }
        } else {
            // ERC20 gift
            IERC20 tokenContract = IERC20(token);
            require(tokenContract.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
            
            // Refund excess ETH if any
            uint256 excess = msg.value - fee;
            if (excess > 0) {
                (bool refundSuccess, ) = msg.sender.call{value: excess}("");
                require(refundSuccess, "Refund failed");
            }
        }
        
        // Store gift information
        gifts[secretHash] = Gift({
            creator: msg.sender,
            token: token,
            amount: amount,
            expiryTime: expiryTime,
            claimed: false
        });
        
        emit GiftCreated(secretHash, msg.sender, token, amount, expiryTime);
    }
    
    /**
     * @dev Claims a gift using the secret
     * @param secret Secret to claim the gift
     * @param recipient Address to receive the gift
     */
    function claimGift(bytes32 secret, address recipient) external nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        
        // Calculate secret hash
        bytes32 secretHash = keccak256(abi.encodePacked(secret));
        
        // Get gift information
        Gift storage gift = gifts[secretHash];
        
        require(gift.creator != address(0), "Gift does not exist");
        require(!gift.claimed, "Gift already claimed");
        require(block.timestamp <= gift.expiryTime, "Gift has expired");
        
        // Mark gift as claimed
        gift.claimed = true;
        
        // Transfer gift to recipient
        if (gift.token == address(0)) {
            // ETH transfer
            (bool success, ) = recipient.call{value: gift.amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 transfer
            IERC20 tokenContract = IERC20(gift.token);
            require(tokenContract.transfer(recipient, gift.amount), "Token transfer failed");
        }
        
        emit GiftClaimed(secretHash, recipient);
    }
    
    /**
     * @dev Cancels a gift and returns funds to creator
     * @param secretHash Hash of the secret for the gift to cancel
     */
    function cancelGift(bytes32 secretHash) external nonReentrant {
        // Get gift information
        Gift storage gift = gifts[secretHash];
        
        require(gift.creator == msg.sender, "Only creator can cancel gift");
        require(!gift.claimed, "Gift already claimed");
        
        // Mark gift as claimed to prevent future claims
        gift.claimed = true;
        
        // Return funds to creator
        if (gift.token == address(0)) {
            // ETH return
            (bool success, ) = gift.creator.call{value: gift.amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 return
            IERC20 tokenContract = IERC20(gift.token);
            require(tokenContract.transfer(gift.creator, gift.amount), "Token transfer failed");
        }
        
        emit GiftCancelled(secretHash, gift.creator);
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
