
/**
 * Auxiliary function to create an instance of some smart contract
 * whose address is known.
 * @param {Function} contractInstance Instance of Blockchain smart contract.
 * @param {string} ownerAddress String representation of the Ethereum
 *                                 address of the owner.
 * @returns {Promise} A promise which resolves to the the devices owned by user.
 */
export function getDeployedDevices(contractInstance, ownerAddress) {
    return contractInstance.getDeployedDevices({ from: ownerAddress })
}

