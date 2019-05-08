const OracleHandler = require('./../OracleHandler')
const request = require('request')
const web3 = require('../../web3')

class MintRouterHandler extends OracleHandler {

  constructor() {
    super()
  }

  getWalletAddress(ip, originator, callback) {
    let url = "http://" + ip + ":9000/owner"
    request(url, function (error, response, body) {
      if (error)
        console.log("error: " + error)
      //console.log("status code: " + response.statusCode);
      console.log(body);
      let address = body.trim()
      originator = web3.utils.toChecksumAddress(originator)
      address = web3.utils.toChecksumAddress(address)
      console.log(originator)
      console.log(address)
      if (originator != address) {
        //console.log("Originator and device address do not match")
        throw "Originator and device address do not match"
      } else {
        callback(address)
      }
    })
  }

  getTransaction(account, recipient, originator, result, callback) {
    console.log('Send Transaction');
    let transaction = {
      from: account,
      to: recipient,
      data: web3.eth.abi.encodeFunctionCall({
        name: '__mintRouterCallback',
        type: 'function',
        inputs: [{
          type: 'uint256',
          name: '_uid'
        }, {
          type: 'string',
          name: '_ip'
        }, {
          type: 'address',
          name: '_address'
        }, {
          type: 'address',
          name: '_originator'
        }]
      }, [web3.utils.toBN(result.id), result.ip, web3.utils.toChecksumAddress(result.wallet), originator]),
      gas: web3.utils.numberToHex(500000)
    }
    console.log('Sending transaction from MintRouterHandler')
    callback(transaction)
  }

}

module.exports = MintRouterHandler