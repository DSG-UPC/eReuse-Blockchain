const web3 = require('./../web3')

class OracleHandler {

    getWeb3() {
        return web3
    }

    /**
     * Main method for parent Handlers. Is in charge of handling the
     * request redirected from the Oracle. First does the needed checkings,
     * then performs the required operation and finally invokes the
     * getTransaction() function.
     * 
     * @param {String} _id Identifier for the request.
     * @param {String} _recipient The address of the contract where the
     *                              method callback is defined.
     * @param {String} _originator The addresss of the contract that sent
     *                              the request to the oracle
     * @param {Object} _data The content of the request. Likely to be 
     *                          a String or a JSON object.
     * @param {Function} _callback Function to save the result to use it later.
     */
    handle(_id, _recipient, _originator, _data, _callback) {}

    /**
     * This function is in charge of creating the structure for the transaction
     * that will represent the callback invocation.
     * 
     * @param {String} _account Oracle address.
     * @param {String} _recipient The address of the contract where the
     *                              method callback is defined.
     * @param {Object} _result The contents to be returned to the contract
     *                          inside the callback method.
     * @param {Function} _callback Function to save the result to use it later.
     */
    getTransaction(_account, _recipient, _result, _callback) {}
}

module.exports = OracleHandler