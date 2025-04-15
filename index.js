import Head from 'next/head';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from '../components/Navbar';
import WalletScrubber from '../components/WalletScrubber';
import PrivateSend from '../components/PrivateSend';
import GiftLink from '../components/GiftLink';

export default function Home() {
  const [activeTab, setActiveTab] = useState('wallet-scrubber');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head>
        <title>Pr1v.app - Privacy Toolkit for Crypto</title>
        <meta name="description" content="Decentralized privacy toolkit for crypto assets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Pr1v.app</h1>
          <ConnectButton />
        </div>

        <div className="card mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Pr1v.app is a decentralized privacy toolkit built to empower users with full control over their digital assets while maintaining anonymity and security.
          </p>
          <div className="flex space-x-4">
            <button 
              className={`${activeTab === 'wallet-scrubber' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('wallet-scrubber')}
            >
              Wallet Scrubber
            </button>
            <button 
              className={`${activeTab === 'private-send' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('private-send')}
            >
              Private Send
            </button>
            <button 
              className={`${activeTab === 'gift-link' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('gift-link')}
            >
              Gift Link
            </button>
          </div>
        </div>

        {activeTab === 'wallet-scrubber' && <WalletScrubber />}
        {activeTab === 'private-send' && <PrivateSend />}
        {activeTab === 'gift-link' && <GiftLink />}
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Pr1v.app - Privacy-focused tools for crypto
          </p>
        </div>
      </footer>
    </div>
  );
}
