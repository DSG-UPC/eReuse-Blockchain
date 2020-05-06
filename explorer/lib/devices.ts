import { utils } from 'ethers'
import { Address } from './types'
/**
 * Auxiliary function to create an instance of some smart contract
 * whose address is known.
 * @param {Function} contractInstance Instance of Blockchain smart contract.
 * @param {string} ownerAddress String representation of the Ethereum
 *                                 address of the owner.
 * @returns {Promise} A promise which resolves to the the devices owned by user.
 */
export function getDeployedDevices(contractInstance, ownerAddress: Address): Promise<Address[]> {
    return contractInstance.getDeployedDevices({ from: ownerAddress })
}

export type DeviceInfo = {
    uid: string,
    owner: Address,
    deposit: string,
    state: number
}

export async function getDeviceInformation(contractInstance): Promise<DeviceInfo> {
    let deposit = utils.bigNumberify(await contractInstance.getDeposit.call()).toString()
    let uid = utils.bigNumberify(await contractInstance.getUid.call()).toString()
    let owner = await contractInstance.getOwner.call() as Address
    // let state = contractInstance.state.call()
    return {
        uid,
        owner,
        deposit,
        state: 0
    }
}

export async function hasDeviceProofs(contractInstance, proofType: string): Promise<boolean> {
    return await contractInstance.hasProofs(proofType);
}