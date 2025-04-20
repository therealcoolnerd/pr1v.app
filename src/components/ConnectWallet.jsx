import React from 'react';
import { useConnect, useAccount } from 'wagmi';

function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full border border-gray-600"
    >
      {isConnected ? 'Connected' : 'Connect Wallet'}
    </button>
  );
}

export default ConnectWallet;