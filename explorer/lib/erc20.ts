
/**
 * Auxiliary function to create an instance of some smart contract
 * whose address is known.
 * @param {Function} provider Blockchain provider configuration.
 * @param {string} contractAddress String representation of the Ethereum
 *                                 address of the contract.
 * @param {File} artifacts JSON representation of smart contract.
 * @returns {Promise} A promise which resolves to the the smart contract instance.
 */
export function getTokens(contractInstance, ethAddress) {
    return contractInstance.balanceOf(ethAddress)
}

