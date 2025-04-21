???jsx
--- a/src/components/components.jsx
+++ b/src/components/components.jsx

 import React, { useState, useEffect } from "react";
 import config from '../../config';
 import db from '../../db';
import WalletScrubberPage from "./WalletScrubberPage"; // Import the WalletScrubberPage

// Mock wallet and blockchain functionality
const mockWallet = {
    connect: () => new Promise(resolve => setTimeout(resolve, 500)),
    address: "0x1234...5678",
    networkName: "Ethereum Mainnet"
};

// Navigation Component that receives activeTab and setActiveTab as props
 export function Navigation({ activeTab, setActiveTab }) {
   const tabs = [
    { id: "wallet-scrubber", name: "Wallet Scrubber" },
    { id: "zk-send", name: "ZK Send" },
    { id: "gift-links", name: "Gift Links" },
    { id: "about", name: "About" },
  ];

  return (
    <div className="bg-gray-800 px-4 py-2">
      <div className="max-w-5xl mx-auto flex flex-wrap"> 
         {tabs.map((tab) => (
           <button
             key={tab.id}
             className={`mr-4 py-2 px-3 rounded-md font-medium ${
               activeTab === tab.id
                 //Change style to selected tab.
                 ? 'bg-blue-500 text-white'
                 : 'text-gray-300 hover:bg-gray-700 hover:text-white'
             }`}
             onClick={() => setActiveTab(tab.id)}
           >
             {tab.name}
           </button>
         ))}
       </div>
     </div>
   );
 }
 
 // Connect Wallet Component that receives isConnected and setIsConnected as props
 export function ConnectWallet({ isConnected, setIsConnected }) {
   const connectWallet = async () => {
     try {
       // Mock connection process, simulate the connection.
       await mockWallet.connect();
       setIsConnected(true);
       localStorage.setItem('walletConnected', 'true');
     } catch (error) {
       console.error("Failed to connect wallet:", error); // Error handling
     }
   };
 
   const disconnectWallet = () => {
     setIsConnected(false);
     localStorage.setItem('walletConnected', 'false');
   };
 
   return (
     <button
       //Connect or disconnect wallet based on isConnected state.
       onClick={isConnected ? disconnectWallet : connectWallet}
       className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full border border-gray-600"
     >
       {isConnected ? 'Disconnect' : 'Connect Wallet'}
     </button>
   );
 }
 
 // Wallet Status Component to show if the wallet is connected
 export function WalletStatus() {
   const [isConnected, setIsConnected] = useState(false);
 
   useEffect(() => {
     const savedStatus = localStorage.getItem('walletConnected');
     setIsConnected(savedStatus === 'true');
 
     // Listen for storage changes to update the connection state.
     const handleStorageChange = () => {
       setIsConnected(localStorage.getItem('walletConnected') === 'true');
     };
 
     window.addEventListener('storage', handleStorageChange);
     return () => window.removeEventListener('storage', handleStorageChange);
   }, []);
 
   return (
     <div className="p-4">
       {isConnected ? (
         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
           <strong className="font-bold">Connected: </strong>
           <span className="block sm:inline">
             {mockWallet.networkName}
           </span>
           <br />
           <strong className="font-bold">Address: </strong>
           <span className="block sm:inline">
             {mockWallet.address}
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
 
 // ZK Send Page Component that receives isConnected as props
 export function ZKSendPage({isConnected}) {
   const [recipient, setRecipient] = useState('');
   const [amount, setAmount] = useState('');
     
   return (
     <div className="flex flex-col items-center justify-center p-4">
       <h1 className="text-4xl font-bold text-gray-900 mb-8">ZK Send</h1>
 
       <section className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md w-full">
         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Privately</h2>
 
         <div className="mb-4">
           <label htmlFor="recipient" className="block text-gray-700 mb-2">
             Recipient Address
           </label>
           <input
             type="text"
             id="recipient"
             className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
             placeholder="0x..."
             value={recipient}
             onChange={(e) => setRecipient(e.target.value)}
           />
         </div>
 
         <div className="mb-6">
           <label htmlFor="amount" className="block text-gray-700 mb-2">
             Amount (ETH)
           </label>
           <input
             type="text"
             id="amount"
             className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
             placeholder="0.0"
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
           />
         </div>
 
         {isConnected ? (
           <button
             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
           >
             Send Privately
           </button>
         ) : (
           <p className="text-gray-700">Connect your wallet to use this feature.</p>
         )}
       </section>
     </div>
   );
 }
 
 // Gift Links Page Component that receives isConnected as props
 export function GiftLinksPage({isConnected}) {
   const [amount, setAmount] = useState('');
   const [expiryDays, setExpiryDays] = useState('7');
 
     return (
         //GiftLinksPage
     <div className="flex flex-col items-center justify-center p-4"> 
       <h1 className="text-4xl font-bold text-gray-900 mb-8">Gift Links</h1>
 
       <section className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md w-full">
         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Gift Link</h2>
 
         <div className="mb-4">
           <label htmlFor="amount" className="block text-gray-700 mb-2">
             Amount (ETH)
           </label>
           <input
             type="text"
             id="amount"
             className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
             placeholder="0.0"
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
           />
         </div>
 
         <div className="mb-6">
           <label htmlFor="expiry" className="block text-gray-700 mb-2">
             Expiry (Days)
           </label>
           <select
             id="expiry"
             className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
             value={expiryDays}
             onChange={(e) => setExpiryDays(e.target.value)}
           >
             <option value="1">1 day</option>
             <option value="7">7 days</option>
             <option value="30">30 days</option>
             <option value="90">90 days</option>
           </select>
         </div>
 
         {isConnected ? (
           <button
             className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
           >
             Create Gift Link
           </button>
         ) : (
           <p className="text-gray-700">Connect your wallet to use this feature.</p>
         )}
       </section>
     </div>
   );
 }
 
 // About Page Component, that shows information about the app.
 export function AboutPage() {
   return (
     <div className="flex flex-col items-center justify-center p-4">
       <h1 className="text-4xl font-bold text-gray-900 mb-8">About PR1V</h1>
 
       <section className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-2xl w-full">
         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacy Tools for Ethereum</h2>
 
         <p className="text-gray-700 mb-4">
           PR1V is a suite of privacy-enhancing tools for Ethereum users. Our mission is to provide simple,
           effective solutions for maintaining financial privacy on public blockchains.
         </p>
 
         <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">Features</h3>
 
         <ul className="list-disc pl-5 text-gray-700 mb-6">
           <li className="mb-2"><strong>Wallet Scrubber:</strong> Remove traces of activity from your wallet by burning tokens.</li>
           <li className="mb-2"><strong>ZK Send:</strong> Send assets privately using zero-knowledge proofs.</li>
           <li className="mb-2"><strong>Gift Links:</strong> Create shareable links that allow anyone to claim assets without revealing your identity.</li>
         </ul>
 
         <h3 className="text-xl font-semibold text-gray-800 mb-2">Security</h3>
         <p className="text-gray-700">
           All PR1V tools are open source and have undergone security audits. We use industry-standard cryptography
           and smart contract design patterns to ensure the safety of your assets.
         </p>
       </section>
     </div>
   );
 }
 
 // Content Router Component, that receives activeTab as props to know what component to show.
 export function ContentRouter({ activeTab }) {
   
   //Object that maps the names of the tabs with the components.
   const components = {
     'zk-send': ZKSendPage,
     'gift-links': GiftLinksPage,
     'about': AboutPage,
     'wallet-scrubber': WalletScrubberPage,
   };
     
   //Select the component based on the activeTab, if not found, return null.
   const SelectedComponent = components[activeTab] || (() => null); 
 
   return <SelectedComponent />; // Return the selected component
 }
