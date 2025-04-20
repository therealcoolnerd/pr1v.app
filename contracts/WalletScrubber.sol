// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WalletScrubber is Ownable {
    uint256 public fee;
    address public feeRecipient;
    address public burnAddress;

    event TokensBurned(address indexed token, uint256 amount);

    constructor(uint256 _fee, address _feeRecipient) {
        fee = _fee;
        feeRecipient = _feeRecipient;
        burnAddress = address(0xdead);
    }

    function setBurnAddress(address _burn) external onlyOwner {
        burnAddress = _burn;
    }

    function setFeeRecipient(address _recipient) external onlyOwner {
        feeRecipient = _recipient;
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function scrub(address token) external payable {
        require(msg.value >= fee, "fee");
        uint256 bal = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(burnAddress, bal);
        if (fee > 0) payable(feeRecipient).transfer(fee);
        emit TokensBurned(token, bal);
    }
}