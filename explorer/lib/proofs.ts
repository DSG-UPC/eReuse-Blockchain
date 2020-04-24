import { proof } from "./types";

/**
 * Auxiliary function to create an instance of some smart contract
 * whose address is known.
 * @param {Function} contractInstance Instance of Blockchain smart contract.
 * @param {string} ownerAddress String representation of the Ethereum
 *                                 address of the owner.
 * @returns {Promise} A promise which resolves to the the devices owned by user.
 */
export function getProofsFromDevice(contractInstance, proofType) {
    return contractInstance.getProofs(proofType);
}

export function getProofInformation(contractInstance, proofHash, proofType) {
    switch (proofType) {
        case 'ProofDataWipe':
            return contractInstance.getDataWipeProof(proofHash);
        case 'ProofTransfer':
            return contractInstance.getTransferProof(proofHash);
        case 'ProofFunction':
            return contractInstance.getFunctionProof(proofHash);
        case 'ProofReuse':
            return contractInstance.getReuseProof(proofHash);
        case 'ProofRecycling':
            return contractInstance.getRecycleProof(proofHash);
        default:
            break;
    }
}

