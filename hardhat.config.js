require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    amoy: {
      url: process.env.ALCHEMY_RPC_URL || "https://rpc-amoy.polygon.technology/",
      accounts: process.env.PRIVATE_KEY_OWNER ? [process.env.PRIVATE_KEY_OWNER] : [],
      chainId: 80002,
    },
    polygon: {
      url: process.env.ALCHEMY_RPC_URL || "https://polygon-rpc.com/",
      accounts: process.env.PRIVATE_KEY_OWNER ? [process.env.PRIVATE_KEY_OWNER] : [],
      chainId: 137,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};