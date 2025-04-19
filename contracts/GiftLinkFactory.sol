// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GiftLinkFactory {
    struct GiftLink {
        address token;
        uint256 amount;
        uint256 expiry;
        bool claimed;
    }
    uint256 public fee;
    address public feeRecipient;
    mapping(bytes32 => GiftLink) public giftLinks;

    event GiftCreated(bytes32 indexed hash, address token, uint256 amount, uint256 expiry);
    event GiftClaimed(bytes32 indexed hash, address indexed to);

    constructor(uint256 _fee, address _feeRecipient) {
        fee = _fee;
        feeRecipient = _feeRecipient;
    }

    function createGift(address token, uint256 amount, bytes32 secretHash, uint256 expiry) external payable {
        require(giftLinks[secretHash].expiry == 0, "exists");
        require(expiry > block.timestamp, "bad expiry");
        if (token == address(0)) {
            require(msg.value >= amount + fee, "eth low");
        } else {
            require(msg.value >= fee, "fee low");
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
        giftLinks[secretHash] = GiftLink(token, amount, expiry, false);
        if (fee > 0) payable(feeRecipient).transfer(fee);
        emit GiftCreated(secretHash, token, amount, expiry);
    }

    function claim(bytes32 secret, address to) external {
        bytes32 h = keccak256(abi.encodePacked(secret));
        GiftLink storage g = giftLinks[h];
        require(!g.claimed && g.expiry >= block.timestamp, "invalid");
        g.claimed = true;
        if (g.token == address(0)) {
            payable(to).transfer(g.amount);
        } else {
            IERC20(g.token).transfer(to, g.amount);
        }
        emit GiftClaimed(h, to);
    }
}
