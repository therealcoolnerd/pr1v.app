import React, { useState } from 'react';
import { ethers } from 'ethers';
import GiftSenderABI from '../abis/GiftSender.json';

const GiftSender = ({ provider, contractAddress }) => {
  const [assetType, setAssetType] = useState('ERC20');
  const [assetAddress, setAssetAddress] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amountOrId, setAmountOrId] = useState('');
  const [fee, setFee] = useState('0.01'); // ETH

  const handleSend = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, GiftSenderABI, signer);
    const feeInWei = ethers.utils.parseEther(fee);

    if (assetType === 'ERC20') {
      await contract.sendTokenGift(assetAddress, recipient, amountOrId, { value: feeInWei });
    } else {
      await contract.sendNFTGift(assetAddress, recipient, amountOrId, { value: feeInWei });
    }
  };

  return (
    <div>
      <h3>Send a Gift</h3>
      <select onChange={(e) => setAssetType(e.target.value)}>
        <option value="ERC20">ERC20 Token</option>
        <option value="ERC721">ERC721 NFT</option>
      </select>
      <input placeholder="Asset Contract Address" onChange={(e) => setAssetAddress(e.target.value)} />
      <input placeholder="Recipient Address" onChange={(e) => setRecipient(e.target.value)} />
      <input placeholder={assetType === 'ERC20' ? "Token Amount" : "NFT Token ID"} onChange={(e) => setAmountOrId(e.target.value)} />
      <button onClick={handleSend}>Send Gift</button>
    </div>
  );
};

export default GiftSender;