const { PRIVATE_KEY, VITE_RPC_URL, ETHERSCAN_API_KEY } = process.env;
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
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
