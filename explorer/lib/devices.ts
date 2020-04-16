
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

export type DeviceInfo = {
    uid: number,
    owner: string,
    deposit: number,
    state: number

}

export function getDeviceInformation(contractInstance): DeviceInfo {
    let deposit = contractInstance.getDeposit.call()
    let uid = contractInstance.getOwner.call()
    let owner = contractInstance.getUid.call()
    let state = contractInstance.state.call()
    return {
        uid,
        owner,
        deposit,
        state
    }
}

