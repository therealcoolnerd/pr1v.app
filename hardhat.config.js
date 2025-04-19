import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
dotenv.config();

const { PRIVATE_KEY, VITE_RPC_URL, ETHERSCAN_API_KEY } = process.env;

export default {
  solidity: '0.8.19',
  networks: {
    sepolia: {
      url: VITE_RPC_URL || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || '',
  },
};
