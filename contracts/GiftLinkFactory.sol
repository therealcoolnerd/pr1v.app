// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GiftLinkFactory {
    struct GiftLink {
        address creator;
        address token;
        uint256 amount;
        uint256 expiry;
        bool claimed;
    }

    uint256 public fee;
    address public feeRecipient;
    mapping(bytes32 => GiftLink) public giftLinks;

    event GiftLinkCreated(bytes32 indexed secretHash, address indexed creator, address token, uint256 amount, uint256 expiry);
    event GiftClaimed(bytes32 indexed secretHash, address indexed recipient);
    event GiftCanceled(bytes32 indexed secretHash);

    constructor(uint256 _fee, address _feeRecipient) {
        fee = _fee;
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Create a new gift link.
     * @param token Address of token to gift (use address(0) for ETH).
     * @param amount Amount of tokens or ETH to gift.
     * @param secretHash Hash of the secret for claiming.
     * @param expiry Timestamp when the gift expires.
     */
    function createGiftLink(address token, uint256 amount, bytes32 secretHash, uint256 expiry) external payable {
        require(giftLinks[secretHash].creator == address(0), "Gift already exists");
        require(expiry > block.timestamp, "Expiry must be in the future");
        if (token == address(0)) {
            // ETH gift
            require(msg.value >= amount + fee, "Insufficient ETH for gift and fee");
            // Keep gift amount in contract (msg.value includes gift + fee)
        } else {
            // ERC20 gift
            require(msg.value >= fee, "Insufficient ETH for fee");
            // Transfer tokens from sender to contract
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
        // Record the gift link details
        giftLinks[secretHash] = GiftLink({
            creator: msg.sender,
            token: token,
            amount: amount,
            expiry: expiry,
            claimed: false
        });
        // Transfer fee to feeRecipient
        if (fee > 0) {
            payable(feeRecipient).transfer(fee);
        }
        emit GiftLinkCreated(secretHash, msg.sender, token, amount, expiry);
    }

    /**
     * @dev Claim a gift using the secret.
     * @param secret The secret pre-image corresponding to the gift's secretHash.
     * @param recipient The address to receive the gift.
     */
    function claimGift(bytes32 secret, address recipient) external {
        bytes32 secretHash = keccak256(abi.encodePacked(secret));
        GiftLink storage gift = giftLinks[secretHash];
        require(gift.creator != address(0), "Gift not found");
        require(!gift.claimed, "Gift already claimed");
        require(block.timestamp <= gift.expiry, "Gift expired");
        gift.claimed = true;
        if (gift.token == address(0)) {
            // Transfer ETH gift to recipient
            payable(recipient).transfer(gift.amount);
        } else {
            // Transfer ERC20 gift to recipient
            IERC20(gift.token).transfer(recipient, gift.amount);
        }
        emit GiftClaimed(secretHash, recipient);
    }

    /**
     * @dev Cancel an expired gift and refund to creator.
     * @param secretHash The hash of the secret for the gift to cancel.
     */
    function cancelGift(bytes32 secretHash) external {
        GiftLink storage gift = giftLinks[secretHash];
        require(gift.creator == msg.sender, "Not gift creator");
        require(!gift.claimed, "Gift already claimed");
        require(block.timestamp >= gift.expiry, "Gift not yet expired");
        // Mark as claimed to prevent future claims
        gift.claimed = true;
        if (gift.token == address(0)) {
            // Refund ETH to creator
            payable(msg.sender).transfer(gift.amount);
        } else {
            // Refund tokens to creator
            IERC20(gift.token).transfer(msg.sender, gift.amount);
        }
        emit GiftCanceled(secretHash);
    }
}
