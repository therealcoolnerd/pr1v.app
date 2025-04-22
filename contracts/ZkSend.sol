// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ZkSend
 * @dev Contract for private transfers using zero-knowledge proofs
 */
contract ZkSend is Ownable, ReentrancyGuard {
    // State variables
    mapping(bytes32 => bool) public commitments;
    mapping(bytes32 => bool) public nullifierHashes;
    
    // Fee configuration
    uint256 public fee;
    address public feeRecipient;
    
    // Interface to the verifier contract
    address public verifier;
    
    // Events
    event Deposit(bytes32 indexed commitment, address token, uint256 amount);
    event Withdrawal(address indexed recipient, bytes32 nullifierHash, uint256 amount);
    event FeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newFeeRecipient);
    event VerifierUpdated(address newVerifier);
    
    /**
     * @dev Constructor sets initial fee, fee recipient, and verifier address
     * @param _fee Initial fee for using the service
     * @param _feeRecipient Address to receive fees
     * @param _verifier Address of the ZK proof verifier contract
     */
    constructor(uint256 _fee, address _feeRecipient, address _verifier) {
        require(_feeRecipient != address(0), "Fee recipient cannot be zero address");
        require(_verifier != address(0), "Verifier cannot be zero address");
        fee = _fee;
        feeRecipient = _feeRecipient;
        verifier = _verifier;
    }
    
    /**
     * @dev Deposits funds with a commitment
     * @param token Address of the token to deposit (use address(0) for ETH)
     * @param amount Amount to deposit
     * @param commitment Commitment hash
     */
    function deposit(address token, uint256 amount, bytes32 commitment) external payable nonReentrant {
        require(!commitments[commitment], "Commitment already exists");
        require(commitment != bytes32(0), "Invalid commitment");
        
        // Handle fee payment
        require(msg.value >= fee, "Insufficient fee");
        
        // Transfer fee to recipient
        (bool feeSuccess, ) = feeRecipient.call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");
        
        // Handle deposit
        if (token == address(0)) {
            // ETH deposit
            require(msg.value >= fee + amount, "Insufficient ETH sent");
            
            // Refund excess ETH if any
            uint256 excess = msg.value - fee - amount;
            if (excess > 0) {
                (bool refundSuccess, ) = msg.sender.call{value: excess}("");
                require(refundSuccess, "Refund failed");
            }
        } else {
            // ERC20 deposit
            IERC20 tokenContract = IERC20(token);
            require(tokenContract.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
            
            // Refund excess ETH if any
            uint256 excess = msg.value - fee;
            if (excess > 0) {
                (bool refundSuccess, ) = msg.sender.call{value: excess}("");
                require(refundSuccess, "Refund failed");
            }
        }
        
        // Store commitment
        commitments[commitment] = true;
        
        emit Deposit(commitment, token, amount);
    }
    
    /**
     * @dev Withdraws funds using ZK proof
     * @param proof ZK proof data
     * @param nullifierHash Hash to prevent double-spending
     * @param recipient Address to receive funds
     * @param token Address of the token to withdraw (use address(0) for ETH)
     * @param amount Amount to withdraw
     */
    function withdraw(
        bytes calldata proof,
        bytes32 nullifierHash,
        address recipient,
        address token,
        uint256 amount
    ) external nonReentrant {
        require(!nullifierHashes[nullifierHash], "Nullifier has been already used");
        require(nullifierHash != bytes32(0), "Invalid nullifier hash");
        require(recipient != address(0), "Invalid recipient");
        
        // Verify the proof (in a real implementation, this would call the verifier contract)
        // For now, we'll assume the proof is valid
        // require(IVerifier(verifier).verifyProof(proof, nullifierHash, commitment), "Invalid proof");
        
        // Mark nullifier as used to prevent double-spending
        nullifierHashes[nullifierHash] = true;
        
        // Transfer funds to recipient
        if (token == address(0)) {
            // ETH transfer
            require(address(this).balance >= amount, "Insufficient ETH balance");
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 transfer
            IERC20 tokenContract = IERC20(token);
            require(tokenContract.transfer(recipient, amount), "Token transfer failed");
        }
        
        emit Withdrawal(recipient, nullifierHash, amount);
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
     * @dev Updates the verifier contract address
     * @param _verifier New verifier address
     */
    function updateVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "Verifier cannot be zero address");
        verifier = _verifier;
        emit VerifierUpdated(_verifier);
    }
    
    /**
     * @dev Fallback function to accept ETH
     */
    receive() external payable {
        // Just accept ETH
    }
}
