module.exports = {
  // Contract addresses - to be updated after deployment
  contractAddresses: {
    testnet: {
      verifier: "TBD",
      walletScrubber: "TBD",
      zkSend: "TBD",
      giftLinkFactory: "TBD"
    },
    mainnet: {
      verifier: "TBD",
      walletScrubber: "TBD",
      zkSend: "TBD",
      giftLinkFactory: "TBD"
    }
  },
  
  // Contract ABIs
  abis: {
    walletScrubber: [
      "function burnToken(address token, uint256 amount) external payable",
      "function generateMigrationPlan(address newWallet) external payable returns (bool success)",
      "function updateFee(uint256 _fee) external",
      "function updateFeeRecipient(address _feeRecipient) external",
      "function fee() external view returns (uint256)",
      "function feeRecipient() external view returns (address)"
    ],
    zkSend: [
      "function deposit(address token, uint256 amount, bytes32 commitment) external payable",
      "function withdraw(bytes calldata proof, bytes32 nullifierHash, address recipient, address token, uint256 amount) external",
      "function updateFee(uint256 _fee) external",
      "function updateFeeRecipient(address _feeRecipient) external",
      "function updateVerifier(address _verifier) external",
      "function fee() external view returns (uint256)",
      "function feeRecipient() external view returns (address)",
      "function verifier() external view returns (address)"
    ],
    giftLinkFactory: [
      "function createGiftLink(address token, uint256 amount, bytes32 secretHash, uint256 expiryTime) external payable",
      "function claimGift(bytes32 secret, address recipient) external",
      "function cancelGift(bytes32 secretHash) external",
      "function updateFee(uint256 _fee) external",
      "function updateFeeRecipient(address _feeRecipient) external",
      "function fee() external view returns (uint256)",
      "function feeRecipient() external view returns (address)"
    ],
    verifier: [
      "function verifyProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public pure returns (bool)",
      "function verifyBatchProof(uint[2][] memory a, uint[2][2][] memory b, uint[2][] memory c, uint[2][] memory input) public pure returns (bool[] memory)"
    ]
  },
  
  // Network configuration
  networks: {
    testnet: {
      name: "Goerli Test Network",
      chainId: 5,
      blockExplorer: "https://goerli.etherscan.io"
    },
    mainnet: {
      name: "Ethereum Mainnet",
      chainId: 1,
      blockExplorer: "https://etherscan.io"
    }
  },
  
  // Fee configuration
  fees: {
    default: "0.01" // in ETH
  },
  
  // Payout address
  payoutAddress: "0x52b1b0673b856B214d7fE4846cf9509Ef7F0d74D"
};
