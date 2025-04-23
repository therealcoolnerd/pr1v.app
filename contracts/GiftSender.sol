// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract GiftSender {
    address public owner;
    uint256 public flatFee;

    event GiftSent(address indexed sender, address indexed recipient, string assetType, address assetAddress, uint256 amountOrId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(uint256 _flatFee) {
        owner = msg.sender;
        flatFee = _flatFee;
    }

    function sendTokenGift(address token, address recipient, uint256 amount) external payable {
        require(msg.value >= flatFee, "Insufficient fee");
        IERC20(token).transferFrom(msg.sender, recipient, amount);
        emit GiftSent(msg.sender, recipient, "ERC20", token, amount);
    }

    function sendNFTGift(address nft, address recipient, uint256 tokenId) external payable {
        require(msg.value >= flatFee, "Insufficient fee");
        IERC721(nft).safeTransferFrom(msg.sender, recipient, tokenId);
        emit GiftSent(msg.sender, recipient, "ERC721", nft, tokenId);
    }

    function withdrawFees() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function updateFee(uint256 newFee) external onlyOwner {
        flatFee = newFee;
    }
}