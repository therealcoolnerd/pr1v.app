import React from 'react';
// Import example components (if available)
import Navbar from './Navbar';
import WalletScrubber from './WalletScrubber';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Example navigation bar */}
      {Navbar && <Navbar />}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to PR1V</h1>
        {/* Example feature component */}
        {WalletScrubber ? <WalletScrubber /> : <p>PR1V frontend is running.</p>}
      </main>
    </div>
  );
}

export default App;
