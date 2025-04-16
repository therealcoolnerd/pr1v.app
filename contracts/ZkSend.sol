// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVerifier {
    function verifyProof(bytes memory proof, uint256[] memory pubSignals) external view returns (bool);
}

contract ZkSend {
    uint256 public fee;
    address public feeRecipient;
    IVerifier public verifier;

    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifierHashes;

    event Deposit(address indexed sender, address token, uint256 amount, bytes32 indexed commitment);
    event Withdrawal(address indexed recipient, address token, uint256 amount, bytes32 indexed nullifierHash);

    constructor(uint256 _fee, address _feeRecipient, address _verifier) {
        fee = _fee;
        feeRecipient = _feeRecipient;
        verifier = IVerifier(_verifier);
    }

    /**
     * @dev Deposit funds to the shielded pool.
     * @param token Address of token to deposit (use address(0) for ETH).
     * @param amount Amount of tokens or ETH to deposit.
     * @param commitment Commitment hash to identify the deposit in the shielded pool.
     */
    function deposit(address token, uint256 amount, bytes32 commitment) external payable {
        require(!commitments[commitment], "Commitment already used");
        if (token == address(0)) {
            // Deposit ETH
            require(msg.value >= amount + fee, "Insufficient ETH for deposit and fee");
            // Keep deposit amount in contract
        } else {
            // Deposit ERC20
            require(msg.value >= fee, "Insufficient ETH for fee");
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
        commitments[commitment] = true;
        // Transfer fee to feeRecipient
        if (fee > 0) {
            payable(feeRecipient).transfer(fee);
        }
        emit Deposit(msg.sender, token, amount, commitment);
    }

    /**
     * @dev Withdraw funds from the shielded pool using a zero-knowledge proof.
     * @param proof Zero-knowledge proof data.
     * @param nullifierHash Hash of the nullifier for this withdrawal (to prevent double spending).
     * @param recipient Address to receive the withdrawn funds.
     * @param token Address of token to withdraw (address(0) for ETH).
     * @param amount Amount of tokens or ETH to withdraw.
     */
    function withdraw(bytes memory proof, bytes32 nullifierHash, address recipient, address token, uint256 amount) external {
        require(!nullifierHashes[nullifierHash], "Nullifier already used");
        // In a real implementation, we would verify the proof against the commitment Merkle root and public signals.
        // For now, we assume proof is valid or rely on the verifier if integrated.
        uint256[] memory publicSignals = new uint256[](0);
        require(verifier.verifyProof(proof, publicSignals), "Invalid proof");
        // Mark nullifier as used
        nullifierHashes[nullifierHash] = true;
        // Transfer funds to recipient
        if (token == address(0)) {
            require(address(this).balance >= amount, "Insufficient contract balance");
            payable(recipient).transfer(amount);
        } else {
            require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient contract token balance");
            IERC20(token).transfer(recipient, amount);
        }
        emit Withdrawal(recipient, token, amount, nullifierHash);
    }
}
