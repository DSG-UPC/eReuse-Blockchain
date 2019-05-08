const Web3 = require('web3');

let web3;

Web3.providers.WebsocketProvider.prototype.sendAsync = Web3.providers.WebsocketProvider.prototype.send

// HTTP for deploying and WS for the rest of the process (oracle needs WS)
const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
web3 = new Web3(provider);
 /*
if (typeof web3.currentProvider.sendAsync !== "function") {
  web3.currentProvider.sendAsync = function() {
    return web3.currentProvider.send.apply(
      web3.currentProvider, arguments
    );
  };
}
*/

module.exports = web3;
