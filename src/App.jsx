import React from "react";
import Navbar from "./components/Navbar";
import WalletScrubberPage from "./components/WalletScrubberPage";
import WalletStatus from "./components/WalletStatus";

import { WagmiProvider, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { publicClient, webSocketPublicClient } = configureChains(
  [
    {
      id: 1,
      name: "Ethereum",
      network: "ethereum",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: ["https://mainnet.infura.io/v3/"] } },
    },
  ],
  [publicProvider()]
);
const config = createConfig({
  publicClient,
  webSocketPublicClient,
});
const queryClient = new QueryClient();
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className='min-h-screen flex flex-col'>
          <Navbar />
          <WalletStatus />
          <WalletScrubberPage />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;