import React, { useState, useEffect, useContext, createContext } from 'react';

// Utility to validate an Ethereum address
tunction isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Mock wallet for demo
const mockWallet = {
  connect: () => new Promise((res) => setTimeout(res, 500)),
  address: '0x1234567890abcdef1234567890abcdef12345678',
  networkName: 'Ethereum Mainnet',
};

// Create a Wallet context
const WalletContext = createContext();

// Connect/Disconnect button component
function ConnectWallet() {
  const { isConnected, updateConnection, disconnect } = useContext(WalletContext);

  const handleConnect = async () => {
    try {
      await mockWallet.connect();
      updateConnection(true, mockWallet.address, mockWallet.networkName);
      localStorage.setItem('walletConnected', 'true');
    } catch (e) {
      console.error('Failed to connect wallet:', e);
    }
  };

  return (
    <button
      onClick={isConnected ? disconnect : handleConnect}
      className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full border border-gray-600"
    >
      {isConnected ? 'Disconnect' : 'Connect Wallet'}
    </button>
  );
}

// Provider to share wallet state
data
function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [networkName, setNetworkName] = useState('');

  useEffect(() => {
    if (localStorage.getItem('walletConnected') === 'true') {
      setIsConnected(true);
      setAddress(mockWallet.address);
      setNetworkName(mockWallet.networkName);
    }
  }, []);

  const updateConnection = (connected, addr = '', net = '') => {
    setIsConnected(connected);
    setAddress(addr);
    setNetworkName(net);
  };

  const disconnect = () => {
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };

  return (
    <WalletContext.Provider value={{ isConnected, address, networkName, updateConnection, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

// Display connection status component
function WalletStatus() {
  const { isConnected, address, networkName } = useContext(WalletContext);

  return (
    <div className="p-4">
      {isConnected ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Connected:</strong> {networkName}
          <br />
          <strong>Address:</strong> {address}
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Not Connected</strong> — please connect your wallet.
        </div>
      )}
    </div>
  );
}

// Wallet Scrubber Page Component
function WalletScrubberPage() {
  const { isConnected } = useContext(WalletContext);
  const [tokenAddress, setTokenAddress] = useState('');
  const [fee, setFee] = useState('0.01');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // simulate fee fetch
    setTimeout(() => setFee('0.01'), 500);
  }, []);

  const handleScrub = async () => {
    if (!tokenAddress) {
      setMessage('Please enter a token address');
      return;
    }
    setLoading(true);
    try {
      setMessage('Scrubbing...');
      await new Promise((r) => setTimeout(r, 2000));

      if (isValidAddress(tokenAddress)) {
        setMessage('Wallet scrubbed successfully!');
        setTxHash('0xTransactionHash');
        setStatus('Success');
      } else {
        throw new Error('Invalid token address');
      }
    } catch (e) {
      console.error(e);
      setMessage(`Error: ${e.message}`);
      setStatus('Failed');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage('');
        setStatus('');
        setTxHash('');
      }, 3000);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Wallet Scrubber</h2>
      <label className="block mb-2">Token Address</label>
      <input
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder="0x..."
        className="w-full mb-3 px-3 py-2 border rounded text-gray-800"
      />
      <p className="mb-3">Fee: {fee} ETH</p>
      {isConnected ? (
        <button
          onClick={handleScrub}
          disabled={loading}
          className={`w-full py-2 font-bold rounded ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
        >
          {loading ? 'Processing...' : 'Scrub Wallet'}
        </button>
      ) : (
        <p className="text-gray-700">Connect your wallet to use this feature.</p>
      )}
      {message && (
        <div className={`mt-4 p-3 rounded ${status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>
      )}
      {status === 'Success' && txHash && (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-500 hover:underline">
          View on Etherscan
        </a>
      )}
    </div>
  );
}

// ZK Send Page Component
function ZKSendPage() {
  const { isConnected } = useContext(WalletContext);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    setStatus('Pending');
    try {
      await new Promise((r) => setTimeout(r, 2000));
      setStatus('Success');
    } catch {
      setStatus('Failed');
    } finally {
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">ZK Send</h2>
      <label className="block mb-2">Recipient Address</label>
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="0x..."
        className="w-full mb-3 px-3 py-2 border rounded text-gray-800"
      />
      <label className="block mb-2">Amount (ETH)</label>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.0"
        className="w-full mb-3 px-3 py-2 border rounded text-gray-800"
      />
      {isConnected ? (
        <button onClick={handleSend} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 font-bold rounded">
          Send Privately
        </button>
      ) : (
        <p className="text-gray-700">Connect your wallet to use this feature.</p>
      )}
      {status && <div className={`mt-4 p-3 rounded ${status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{status}</div>}
    </div>
  );
}

// Gift Links Page Component
function GiftLinksPage() {
  const { isConnected } = useContext(WalletContext);
  const [nfts] = useState([
    { id: '1', name: 'Cool NFT 1' },
    { id: '2', name: 'Awesome NFT 2' },
  ]);
  const [selected, setSelected] = useState([]);
  const [link, setLink] = useState('');

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const createLink = () => {
    if (selected.length === 0) return;
    setLink(`https://pr1v.app/gift/${selected.join(',')}`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gift Links</h2>
      {isConnected ? (
        <>
          <div className="mb-4">
            {nfts.map((nft) => (
              <label key={nft.id} className="block mb-2">
                <input
                  type="checkbox"
                  checked={selected.includes(nft.id)}
                  onChange={() => toggleSelect(nft.id)}
                  className="mr-2"
                />
                {nft.name}
              </label>
            ))}
          </div>
          <button onClick={createLink} className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 font-bold rounded mb-4">
            Create Gift Link
          </button>
          {link && (
            <p className="text-blue-600 break-all">
              Gift Link: {link}
            </p>
          )}
        </>
      ) : (
        <p className="text-gray-700">Connect your wallet to use this feature.</p>
      )}
    </div>
  );
}

// About Page Component
function AboutPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">About PR1V</h2>
      <p className="mb-4">
        PR1V is a suite of privacy-enhancing tools for Ethereum users. Our mission is to provide simple,
        effective solutions for maintaining financial privacy on public blockchains.
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Wallet Scrubber: Remove traces of activity from your wallet by burning tokens.</li>
        <li>ZK Send: Send assets privately using zero-knowledge proofs.</li>
        <li>Gift Links: Create shareable links allowing claim without revealing your identity.</li>
      </ul>
    </div>
  );
}

// Router component
function ContentRouter({ activeTab }) {
  switch (activeTab) {
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

// Main App component
export default function App() {
  const [activeTab, setActiveTab] = useState('wallet-scrubber');
  const tabs = [
    { id: 'wallet-scrubber', name: 'Wallet Scrubber' },
    { id: 'zk-send', name: 'ZK Send' },
    { id: 'gift-links', name: 'Gift Links' },
    { id: 'about', name: 'About' },
  ];

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-gray-900 text-white p-4">
          <div className="max-w-5xl mx-auto flex justify-between">  
            <span className="font-bold text-lg">PR1V</span>
            <ConnectWallet />
          </div>
          <div className="mt-2 max-w-5xl mx-auto flex space-x-4"> 
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded ${activeTab === tab.id ? 'bg-blue-500' : 'hover:bg-gray-700'}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </nav>
        <WalletStatus />
        <ContentRouter activeTab={activeTab} />
      </div>
    </WalletProvider>
  );
}