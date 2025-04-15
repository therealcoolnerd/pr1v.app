require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/${INFURA_API_KEY}",
      accounts: {
        mnemonic: "${MNEMONIC}",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
      accounts: {
        mnemonic: "${MNEMONIC}",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
  },
  etherscan: {
    apiKey: "${ETHERSCAN_API_KEY}",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
