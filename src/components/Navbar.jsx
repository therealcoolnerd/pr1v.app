import React from 'react';

function Navbar() {
  return (
    <nav className="w-full bg-gray-900 border-b border-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-lg font-semibold">PR1V</span>
        <span className="text-xs text-gray-400">alpha</span>
      </div>
    </nav>
  );
}

export default Navbar;