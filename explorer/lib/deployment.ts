import EIP20 from '../../build/contracts/EIP20.json'
import DeviceFactory from '../../build/contracts/DeviceFactory.json'
import ProofsHandler from '../../build/contracts/ProofsHandler.json'
import DepositDevice from '../../build/contracts/DepositDevice.json'
const contract = require('@truffle/contract')
import  { ethers, providers} from 'ethers'



/**
 * Auxiliary function to create an instance of some smart contract
 * whose address is known.
 * @param {Function} provider Blockchain provider configuration.
 * @param {string} contractAddress String representation of the Ethereum
 *                                 address of the contract.
 * @param {File} artifacts JSON representation of smart contract.
 * @param {string} address contract address in case it is needed.
 * @returns {Promise} A promise which resolves to the the smart contract instance.
 */
function getContractInstance(provider: providers.Web3Provider, network, artifacts, address = null) {
    let contractAddress;
    if (address)
        contractAddress =  ethers.utils.getAddress(address)
    else
        contractAddress = artifacts.networks[network].address;
    let deviceContract = initializeContract(provider, artifacts)
    console.log(deviceContract)
    const signer = provider.getSigner()
    return new ethers.Contract(contractAddress, deviceContract.abi, signer);
}

export function getDeviceFactory(provider, network) {
    return getContractInstance(provider, network, DeviceFactory);
}

export function getDepositDevice(provider, network, address) {
    return getContractInstance(provider, network, DepositDevice, address);
}

export function getERC20(provider, network) {
    return getContractInstance(provider, network, EIP20);
}

export function getProofsHandler(provider, network) {
    return getContractInstance(provider, network, ProofsHandler);
}

/**
 * Initialize basic properties of smart contract instance.
 * @param {Function} provider Blockchain provider configuration.
 * @param {File} artifacts JSON representation of smart contract.
 * @returns {Function} Structure of the smart contract.
 */
function initializeContract(provider, artifact) {
    // let artifact = JSON.parse(artifacts)
    const myContract = contract({
        abi: artifact.abi,
        unlinked_binary: artifact.deployedBytecode
    })
    myContract.setProvider(provider)
    myContract.defaults({
        gasLimit: '6721975'
    })
    return myContract
}

