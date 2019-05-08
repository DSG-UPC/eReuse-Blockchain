const OracleHandler = require('./../OracleHandler')

class ExistsHandler extends OracleHandler {

    constructor() {
        super()
    }

    getTransaction(account, recipient, result, callback) {
        let exists = false
        if (result) {
            exists = true
        }
        let transaction = {
            from: account,
            to: recipient,
            data: this.getWeb3().eth.abi.encodeFunctionCall({
                name: '__nodeExistsCallback',
                type: 'function',
                inputs: [{
                    type: 'bool',
                    name: '_response'
                }, {
                    type: 'string',
                    name: '_device'
                }]
            }, [exists, JSON.stringify(result)]),
            gas: this.getWeb3().utils.numberToHex(450000)
        }
        callback(transaction)
    }
}

module.exports = ExistsHandler