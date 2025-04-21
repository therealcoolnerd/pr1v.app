import React, { useContext } from "react";
import { useAccount, useChainId } from "wagmi";
import { WalletContext } from "./WalletContext";

function WalletStatus() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { isConnected } = useContext(WalletContext);

  const chainNames = {
    1: "Ethereum Mainnet",
    5: "Goerli Test Network",
  };

  return (
    <div className="p-4">
      {isConnected ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Connected: </strong>
          <span className="block sm:inline">
            {chainNames[chainId] || "Unknown Network"}
          </span>
          <br />
          <strong className="font-bold">Address: </strong>
          <span className="block sm:inline">{address}
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