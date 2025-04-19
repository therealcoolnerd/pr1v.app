// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WalletScrubber {
    uint256 public fee;
    address public feeRecipient;
    address public burnAddress;

    event TokensBurned(address indexed token, uint256 amount);
    event MigrationPlanGenerated(address indexed user, address indexed newWallet);

    constructor(uint256 _fee, address _feeRecipient) {
        fee = _fee;
        feeRecipient = _feeRecipient;
    }

    function setBurnAddress(address _burn) external {
        burnAddress = _burn;
    }

    function setFeeRecipient(address _recipient) external {
        feeRecipient = _recipient;
    }

    function scrub(address token) external payable {
        require(msg.value >= fee, "fee");
        uint256 bal = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(burnAddress, bal);
        if (fee > 0) payable(feeRecipient).transfer(fee);
        emit TokensBurned(token, bal);
    }

    function generateMigrationPlan(address newWallet) external payable returns (bool) {
        require(msg.value >= fee, "fee");
        if (fee > 0) payable(feeRecipient).transfer(fee);
        emit MigrationPlanGenerated(msg.sender, newWallet);
        return true;
    }
}
