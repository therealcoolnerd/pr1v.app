// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

interface IVerifier {
    function verifyProof(bytes memory proof, uint256[] memory pubSignals) external view returns (bool);
}

contract ZkSend is Ownable {
    
    uint256 public fee;
    address public feeRecipient;
    IVerifier public verifier;
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifierHashes;

    event Deposit(bytes32 indexed commitment, address indexed token, uint256 amount);
    event Withdrawal(bytes32 indexed nullifier, address indexed recipient, address indexed token, uint256 amount);

    constructor(uint256 _fee, address _feeRecipient, address _verifier) {
        fee = _fee;
        feeRecipient = _feeRecipient;
        verifier = IVerifier(_verifier);
    }

    function deposit(address token, uint256 amount, bytes32 commitment) external payable {
        require(!commitments[commitment], "commit used");
        if (token == address(0)) {
            require(msg.value >= amount + fee, "insuff ETH");
        } else {
            require(msg.value >= fee, "insuff fee");
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
        commitments[commitment] = true;
        if (fee > 0) payable(feeRecipient).transfer(fee);
        emit Deposit(commitment, token, amount);
    }

    function withdraw(bytes memory proof, uint256[] memory pubSignals, bytes32 nullifier, address recipient, address token, uint256 amount) external {
        require(!nullifierHashes[nullifier], "nullifier used");
        require(verifier.verifyProof(proof, pubSignals), "bad proof");
        nullifierHashes[nullifier] = true;
        if (token == address(0)) {
            payable(recipient).transfer(amount);
        } else {
            IERC20(token).transfer(recipient, amount);
        }
        emit Withdrawal(nullifier, recipient, token, amount);
    }
    
    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function setFeeRecipient(address _recipient) external onlyOwner {
        feeRecipient = _recipient;
    }

    function setVerifier(address _verifier) external onlyOwner {
        verifier = IVerifier(_verifier);
    }
}
