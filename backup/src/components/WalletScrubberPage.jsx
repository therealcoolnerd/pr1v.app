jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletScrubber from '../../artifacts/contracts/WalletScrubber.sol/WalletScrubber.json';
import config from '../../config';

function WalletScrubberPage() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [message, setMessage] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [fee, setFee] = useState(null);

  const handleScrub = async () => {
    setMessage('Scrubbing...');
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Get the fee
        try{
            const feeRecipientContract = new ethers.Contract(
              config.WalletScrubberContractAddress,
              WalletScrubber.abi,
              provider
            );
            const feeAmount = await feeRecipientContract.fee();
            setFee(feeAmount)
        } catch(error) {
          setMessage('Error getting fee. Check console for details.');
          return;
        }
        const signer = provider.getSigner();

        const walletScrubberContract = new ethers.Contract(
          config.WalletScrubberContractAddress,
          WalletScrubber.abi,
          signer
        );

        const tx = await walletScrubberContract.scrub(
          tokenAddress,
          { value: fee }
        );
        await tx.wait();
        setMessage('Wallet scrubbed successfully!');
      } else {
        setMessage(
          'Please install MetaMask or another Ethereum-compatible wallet.'
        );
      }
    } catch (error) {
      console.error('Error scrubbing wallet:', error);
      setMessage('Error scrubbing wallet. Check console for details.');
    }
  };

  useEffect(() => {
    setWalletConnected(window.ethereum && window.ethereum.isConnected());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Wallet Scrubber</h1>

      <section className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-white mb-4">Scrub a Wallet</h2>
        <div className="mb-4">
          <label htmlFor="tokenAddress" className="block text-white mb-2">
            Token Address
          </label>
          <input
            type="text"
            id="tokenAddress"
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
        </div>
        {walletConnected ? (
          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={handleScrub}
          >
            Scrub Wallet
          </button>
        ) : <p>Connect your wallet to use this feature.</p>}
        {message && <p className="mt-4 text-white">{message}</p>}
      </section>
    </div>
  );
}

export default WalletScrubberPage;