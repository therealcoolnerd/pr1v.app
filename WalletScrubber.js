import { useState } from 'react';
import { useAccount, useContract, useSigner, useBalance } from 'wagmi';
import { ethers } from 'ethers';

// This would be replaced with the actual contract ABI and address
const WALLET_SCRUBBER_ABI = [
  "function burnToken(address token, uint256 amount) external payable",
  "function generateMigrationPlan(address newWallet) external payable returns (bool success)"
];
const WALLET_SCRUBBER_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

const WalletScrubber = () => {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const { data: balance } = useBalance({ address });
  
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  
  const walletScrubberContract = useContract({
    address: WALLET_SCRUBBER_ADDRESS,
    abi: WALLET_SCRUBBER_ABI,
    signerOrProvider: signer
  });
  
  const handleBurnToken = async () => {
    if (!isConnected || !walletScrubberContract) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Fee is 0.01 ETH (would be configured based on actual contract)
      const fee = ethers.utils.parseEther('0.01');
      
      // Convert token amount to wei (assuming 18 decimals)
      const amount = ethers.utils.parseUnits(tokenAmount, 18);
      
      // Call the burnToken function
      const tx = await walletScrubberContract.burnToken(
        tokenAddress,
        amount,
        { value: fee }
      );
      
      await tx.wait();
      setTxHash(tx.hash);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error burning token: ' + err.message);
      setIsLoading(false);
    }
  };
  
  const handleGenerateMigrationPlan = async () => {
    if (!isConnected || !walletScrubberContract) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Fee is 0.01 ETH (would be configured based on actual contract)
      const fee = ethers.utils.parseEther('0.01');
      
      // Call the generateMigrationPlan function
      const tx = await walletScrubberContract.generateMigrationPlan(
        newWalletAddress,
        { value: fee }
      );
      
      await tx.wait();
      setTxHash(tx.hash);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error generating migration plan: ' + err.message);
      setIsLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Wallet Scrubber</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Please connect your wallet to use the Wallet Scrubber feature.
        </p>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Wallet Scrubber</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Clean your wallet from toxic or blacklisted tokens. Burn unwanted tokens or generate a migration plan to a new wallet.
      </p>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Burn Token</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Token Address
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="0x..."
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
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
            />
          </div>
          <button
            className="btn-primary w-full"
            onClick={handleBurnToken}
            disabled={isLoading || !tokenAddress || !tokenAmount}
          >
            {isLoading ? 'Processing...' : 'Burn Token'}
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Generate Migration Plan</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Wallet Address
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="0x..."
              value={newWalletAddress}
              onChange={(e) => setNewWalletAddress(e.target.value)}
            />
          </div>
          <button
            className="btn-primary w-full"
            onClick={handleGenerateMigrationPlan}
            disabled={isLoading || !newWalletAddress}
          >
            {isLoading ? 'Processing...' : 'Generate Migration Plan'}
          </button>
        </div>
      </div>
      
      {txHash && (
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-md mb-4">
          <p className="text-green-800 dark:text-green-200">
            Transaction successful! Hash: {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 10)}
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 rounded-md mb-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default WalletScrubber;
