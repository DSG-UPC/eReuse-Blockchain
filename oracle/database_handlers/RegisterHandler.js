const OracleHandler = require('./../OracleHandler')

class RegisterHandler extends OracleHandler {

    constructor() {
        super()
    }

    getTransaction(account, recipient, result, callback) {
        let transaction = {
            from: account,
            to: recipient,
            data: this.getWeb3().eth.abi.encodeFunctionCall({
                name: '__nodeRegisterCallback',
                type: 'function',
                inputs: [{
                    type: 'string',
                    name: '_response'
                }]
            }, [result.wallet.toString()]),
            gas: this.getWeb3().utils.numberToHex(450000)
        }
        callback(transaction)
    }
}

module.exports = RegisterHandler