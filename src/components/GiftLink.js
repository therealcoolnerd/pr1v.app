import { useState } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import { ethers } from 'ethers';

// This would be replaced with the actual contract ABI and address
const GIFT_LINK_FACTORY_ABI = [
  "function createGiftLink(address token, uint256 amount, bytes32 secretHash, uint256 expiryTime) external payable",
  "function claimGift(bytes32 secret, address recipient) external",
  "function cancelGift(bytes32 secretHash) external"
];
const GIFT_LINK_FACTORY_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

const GiftLink = () => {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  
  const [mode, setMode] = useState('create'); // 'create', 'claim', or 'cancel'
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [secret, setSecret] = useState('');
  const [secretHash, setSecretHash] = useState('');
  const [expiryTime, setExpiryTime] = useState('24'); // Default 24 hours
  const [recipient, setRecipient] = useState('');
  const [giftLink, setGiftLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  
  const giftLinkFactoryContract = useContract({
    address: GIFT_LINK_FACTORY_ADDRESS,
    abi: GIFT_LINK_FACTORY_ABI,
    signerOrProvider: signer
  });
  
  const generateRandomSecret = () => {
    const randomBytes = ethers.utils.randomBytes(32);
    const secretValue = ethers.utils.hexlify(randomBytes);
    setSecret(secretValue);
    
    // Calculate hash
    const hash = ethers.utils.keccak256(ethers.utils.arrayify(secretValue));
    setSecretHash(hash);
  };
  
  const handleCreateGiftLink = async () => {
    if (!isConnected || !giftLinkFactoryContract) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Fee is 0.01 ETH (would be configured based on actual contract)
      const fee = ethers.utils.parseEther('0.01');
      
      // Convert amount to wei (assuming 18 decimals)
      const amountInWei = ethers.utils.parseUnits(amount, 18);
      
      // Calculate expiry time in seconds from now
      const expiryTimeInSeconds = Math.floor(Date.now() / 1000) + (parseInt(expiryTime) * 3600);
      
      let tx;
      if (tokenAddress === '' || tokenAddress === '0x0000000000000000000000000000000000000000') {
        // ETH gift
        tx = await giftLinkFactoryContract.createGiftLink(
          ethers.constants.AddressZero,
          amountInWei,
          secretHash,
          expiryTimeInSeconds,
          { value: fee.add(amountInWei) }
        );
      } else {
        // ERC20 gift
        // Note: In a real implementation, you would need to approve the contract first
        tx = await giftLinkFactoryContract.createGiftLink(
          tokenAddress,
          amountInWei,
          secretHash,
          expiryTimeInSeconds,
          { value: fee }
        );
      }
      
      await tx.wait();
      setTxHash(tx.hash);
      
      // Generate gift link URL
      // In a real implementation, this would be a URL to your app with the secret encoded
      const baseUrl = window.location.origin;
      const giftLinkUrl = `${baseUrl}/claim?secret=${encodeURIComponent(secret)}`;
      setGiftLink(giftLinkUrl);
      
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error creating gift link: ' + err.message);
      setIsLoading(false);
    }
  };
  
  const handleClaimGift = async () => {
    if (!isConnected || !giftLinkFactoryContract) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Call the claimGift function
      const tx = await giftLinkFactoryContract.claimGift(
        secret,
        recipient || address // Use connected wallet if no recipient specified
      );
      
      await tx.wait();
      setTxHash(tx.hash);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error claiming gift: ' + err.message);
      setIsLoading(false);
    }
  };
  
  const handleCancelGift = async () => {
    if (!isConnected || !giftLinkFactoryContract) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Call the cancelGift function
      const tx = await giftLinkFactoryContract.cancelGift(secretHash);
      
      await tx.wait();
      setTxHash(tx.hash);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error cancelling gift: ' + err.message);
      setIsLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Gift Link</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Please connect your wallet to use the Gift Link feature.
        </p>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Gift Link</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Create shareable links for anonymous crypto transfers. Perfect for gifts, donations, or payments.
      </p>
      
      <div className="flex space-x-4 mb-6">
        <button
          className={`${mode === 'create' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode('create')}
        >
          Create Gift
        </button>
        <button
          className={`${mode === 'claim' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode('claim')}
        >
          Claim Gift
        </button>
        <button
          className={`${mode === 'cancel' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode('cancel')}
        >
          Cancel Gift
        </button>
      </div>
      
      {mode === 'create' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Token Address (leave empty for ETH)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="0x... or leave empty for ETH"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expiry Time (hours)
            </label>
            <input
              type="number"
              className="input-field"
              placeholder="24"
              value={expiryTime}
              onChange={(e) => setExpiryTime(e.target.value)}
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Secret
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="input-field flex-grow"
                placeholder="0x..."
                value={secret}
                onChange={(e) => {
                  setSecret(e.target.value);
                  if (e.target.value) {
                    const hash = ethers.utils.keccak256(ethers.utils.arrayify(e.target.value));
                    setSecretHash(hash);
                  } else {
                    setSecretHash('');
                  }
                }}
                readOnly
              />
              <button
                className="btn-secondary"
                onClick={generateRandomSecret}
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This secret will be used to generate the gift link. Keep it secure.
            </p>
          </div>
          <button
            className="btn-primary w-full"
            onClick={handleCreateGiftLink}
            disabled={isLoading || !amount || !secretHash}
          >
            {isLoading ? 'Processing...' : 'Create Gift Link'}
          </button>
          
          {giftLink && (
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-md">
              <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                Gift Link Created!
              </p>
              <p className="text-blue-800 dark:text-blue-200 break-all">
                {giftLink}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                Share this link with the recipient. The link will expire in {expiryTime} hours.
              </p>
            </div>
          )}
        </div>
      )}
      
      {mode === 'claim' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Secret
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="0x..."
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter the secret from the gift link you received.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipient Address (optional)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="0x... (leave empty to use your connected wallet)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <button
            className="btn-primary w-full"
            onClick={handleClaimGift}
            disabled={isLoading || !secret}
          >
            {isLoading ? 'Processing...' : 'Claim Gift'}
          </button>
        </div>
      )}
      
      {mode === 'cancel' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Secret Hash
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="0x..."
              value={secretHash}
              onChange={(e) => setSecretHash(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter the secret hash of the gift link you want to cancel.
            </p>
          </div>
          <button
            className="btn-primary w-full"
            onClick={handleCancelGift}
            disabled={isLoading || !secretHash}
          >
            {isLoading ? 'Processing...' : 'Cancel Gift'}
          </button>
        </div>
      )}
      
      {txHash && (
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-md mt-4">
          <p className="text-green-800 dark:text-green-200">
            Transaction successful! Hash: {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 10)}
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 rounded-md mt-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default GiftLink;
