require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    // to deploy the contract on local blockchain you can use ganache-cli
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    polygonTestnet: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [process.env.MUMBAI_PRIVATE_KEY],
          providerOrUrl: process.env.MUMBAI_PROVIDER_URL,
        }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gasPrice: 47000000000,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",
    },
  },

  // for verify plugin
  api_keys: {
    polygonscan: process.env.POLYGONSCAN_KEY,
  },
  plugins: ["truffle-plugin-verify"],
};
