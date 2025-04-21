jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from './ConnectWallet';

function Navbar() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };
  return (
    <nav className="w-full bg-gray-900 border-b border-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-semibold text-white mr-4">PR1V</span>
        <div>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;