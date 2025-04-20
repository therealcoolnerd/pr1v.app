import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-6xl font-bold mb-6 text-center">
        Welcome to PR1V
      </h1>
      <p className="text-2xl text-gray-300 text-center max-w-3xl px-4">
        PR1V is a cutting-edge decentralized application (dApp) designed to enhance privacy and security in your blockchain interactions. With PR1V, you can create gift links for ETH and ERC-20 tokens, engage in private transactions using zero-knowledge technology, and manage your wallet security with our innovative scrubbing feature. Experience the future of private blockchain interactions with PR1V.
      </p>
    </div>
  );
}

export default HomePage;