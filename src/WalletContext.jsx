import React, { createContext, useState, useEffect } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(() => {
    const savedStatus = localStorage.getItem('walletConnected');
    return savedStatus === 'true';
  });

  useEffect(() => {
    localStorage.setItem('walletConnected', isConnected);
  }, [isConnected]);

  return (
    <WalletContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </WalletContext.Provider>
  );
};