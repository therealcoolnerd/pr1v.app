jsx
import React from "react";
import { useAccount, useNetwork } from "wagmi";

function WalletStatus() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  return (
    <div className="p-4">
      {isConnected ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Connected: </strong>
          <span className="block sm:inline">
            {chain?.name}
          </span>
          <br/>
          <strong className="font-bold">Address: </strong>
          <span className="block sm:inline">
          {address}
          </span>
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Not Connected</strong>
          <span className="block sm:inline">
            Please connect your wallet.
          </span>
        </div>
      )}
    </div>
  );
}

export default WalletStatus;