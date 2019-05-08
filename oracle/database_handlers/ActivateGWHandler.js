const OracleHandler = require('./../OracleHandler')

class ActivateGWHandler extends OracleHandler {

    constructor() {
        super()
    }

    getTransaction(account, recipient, result, callback) {
        let transaction = {
            from: account,
            to: recipient,
            data: this.getWeb3().eth.abi.encodeFunctionCall({
                name: '__nodeActivateGWCallback',
                type: 'function',
                inputs: [{
                    type: 'string',
                    name: '_deviceType'
                }, {
                    type: 'string',
                    name: '_device'
                }]
            }, [result.deviceType, JSON.stringify(result)]),
            gas: this.getWeb3().utils.numberToHex(450000)
        }
        callback(transaction)
    }
}

module.exports = ActivateGWHandler