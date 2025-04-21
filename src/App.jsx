import React, { useState, useEffect, useContext, createContext } from 'react';

function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}


// Mock wallet and blockchain functionality
const mockWallet = {
  connect: () => new Promise(resolve => setTimeout(resolve, 500)),
  address: "0x1234...5678",
  networkName: "Ethereum Mainnet"
};


//Wallet Context provider
const WalletContext = createContext();


// Connect Wallet Component (Mock Implementation)
function ConnectWallet() {
  const { isConnected, updateConnection, disconnect } = useContext(WalletContext);
  const connectWallet = async () => {
    try {
      await mockWallet.connect();
      updateConnection(true, mockWallet.address, mockWallet.networkName);
      localStorage.setItem('walletConnected', 'true');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

    const disconnectWallet = () => {
      disconnect();
    };

  return (
    <button
      onClick={isConnected ? disconnectWallet : connectWallet }
      className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full border border-gray-600"
    >
      {isConnected ? 'Disconnect' : 'Connect Wallet'}
    </button>
  );
}

function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [networkName, setNetworkName] = useState('');
  const updateConnection = async (isConnected, address = null, networkName = null) => {
    setIsConnected(isConnected);
    setAddress(address);
    setNetworkName(networkName);
  };
  useEffect(() => {
    const savedStatus = localStorage.getItem('walletConnected');
    if (savedStatus === 'true') {
      updateConnection(true, mockWallet.address, mockWallet.networkName);
    }
  }, []);
  const connect = async () => {
    await mockWallet.connect();
    setIsConnected(true);
    setAddress(mockWallet.address);
    setNetworkName(mockWallet.networkName);
  };
  const disconnect = () => {
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };
  return (
    <WalletContext.Provider value={{ isConnected, address, networkName, updateConnection, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}



// Wallet Status Component
function WalletStatus() {
  const { isConnected, address, networkName } = useContext(WalletContext);
  return(
    <div className="p-4">
      {isConnected ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Connected: </strong>
        <span className="block sm:inline">{networkName}</span>
        <br/>
        <strong className="font-bold">Address: </strong>
        <span className="block sm:inline">{address}</span>
      </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Not Connected</strong>
          <span className="block sm:inline">Please connect your wallet.</span>
        </div>
      )}
    </div>
  )
}
// Wallet Scrubber Page Component
function WalletScrubberPage() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [message, setMessage] = useState('');
  const { isConnected } = useContext(WalletContext);
  const [fee, setFee] = useState("0.01");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock fee retrieval
    setTimeout(() => {
        setFee("0.01");
      }, 500);
  }, []);

  const handleScrub = async () => {
    
    if (!tokenAddress) {
        setMessage('Please enter a token address');
        return;
    }

    if (!isValidAddress(tokenAddress)) {
      setMessage('Invalid token address format');
      
      return;
    }
    
      setIsLoading(true);
    setMessage('Scrubbing...');
    
    // Mock transaction process
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success based on token address format
      setMessage('Scrubbing...')
      if (isValidAddress(tokenAddress)) {        
        setMessage('Wallet scrubbed successfully!');
      } else {
        throw new Error('Invalid token address format');
      }
    } catch (error) {
      console.error('Error scrubbing wallet:', error);
      setMessage(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Wallet Scrubber</h1>

      <section className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Scrub a Wallet</h2>
        <div className="mb-4">
          <label htmlFor="tokenAddress" className="block text-gray-700 mb-2">
            Token Address
          </label>
          <input
            type="text"
            id="tokenAddress"
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0x..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}

          />
          <p className="text-sm text-gray-500 mt-1">
            Enter a valid Ethereum address (starts with 0x, 42 characters)
          </p>
        </div>
        
        {fee && (
          <div className="mb-4 text-gray-700">
            <strong>Fee:</strong> {fee} ETH
          </div>
        )} 

        {isConnected ? (
         <button
            className={`w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleScrub}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Scrub Wallet'}
          </button>
        ) : (
          <p className="text-gray-700">Connect your wallet to use this feature.</p>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </section>
    </div>
  );
}

// ZK Send Page Component
function ZKSendPage() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { isConnected } = useContext(WalletContext);

    return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">ZK Send</h1>
      
      <section className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Privately</h2>
        
        <div className='mb-4'>
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
        
        <div className='mb-6'>
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

// Gift Links Page Component
function GiftLinksPage() {
  const [amount, setAmount] = useState('');
  const [expiryDays, setExpiryDays] = useState('7');
  const { isConnected } = useContext(WalletContext);
  return (
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

// About Page Component
function AboutPage() {
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

// Content Router Component
function ContentRouter({ activeTab }) {
  switch(activeTab) {
    case 'zk-send':
      return <ZKSendPage />;
    case 'gift-links':
      return <GiftLinksPage />;
    case 'about':
      return <AboutPage />;
    case 'wallet-scrubber':
    default:
      return <WalletScrubberPage />;
  }
}


// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('wallet-scrubber');

  const tabs = [
    { id: 'wallet-scrubber', name: 'Wallet Scrubber' },
    { id: 'zk-send', name: 'ZK Send' }, 
    { id: 'gift-links', name: 'Gift Links' },
    { id: 'about', name: 'About' }

  ];

    return (
        <WalletProvider>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <nav className="w-full bg-gray-900 border-b border-gray-700">
                    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                        <span className="text-lg font-semibold text-white mr-4">PR1V</span>
                        <div className="">
                            <ConnectWallet />
                        </div>
                    </div>
                    <div className="bg-gray-800 px-4 py-2">
                        <div className="max-w-5xl mx-auto flex flex-wrap">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`mr-4 py-2 px-3 rounded-md font-medium ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
                  <WalletStatus/>
                <ContentRouter activeTab={activeTab} />
          </div>
        </WalletProvider>
    );
}
