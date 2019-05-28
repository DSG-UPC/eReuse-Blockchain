const web3 = require('./web3');
const ganacheWeb3 = require('./ganache-web3')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      from: '0x28b17326d08992f16d382db2923d0d8b4ff8adb0',
    },
    staging: {
      provider: ganacheWeb3.currentProvider,
      network_id: "7775",
      gas: 5876844,
      // from: '0x28b17326d08992f16d382db2923d0d8b4ff8adb0',
      //from: "",
    },
  },
  compilers: {
    solc: {
      //version: "./node_modules/solc",
      version: '0.4.25',
    }
  }
};
