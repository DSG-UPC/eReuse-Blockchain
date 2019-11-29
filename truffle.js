const web3 = require('./web3');
const ganacheWeb3 = require('./ganache-web3')
// require('mocha-steps') // For sequential 'it' functions

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 6721975,
    },
    staging: {
      provider: ganacheWeb3.currentProvider,
      network_id: "7775",
      gas: 6721975,
      //from: "",
    },
  },
  compilers: {
    solc: {
      //version: "./node_modules/solc",
      version: '0.4.25',
    }
  },
  mocha: {
    useColors: true,
    // require: 'mocha-steps'
  },
};
