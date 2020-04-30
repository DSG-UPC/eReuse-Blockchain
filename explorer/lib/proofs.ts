/**
 * Auxiliary function to create an instance of some smart contract
 * whose address is known.
 * @param {Function} contractInstance Instance of DeviceFactory smart contract.
 * @param {string} ownerAddress String representation of the Ethereum
 *                                 address of the owner.
 * @returns {Promise} A promise which resolves to the the devices owned by user.
 */
export function getProofsFromDevice(contractInstance, proofType) {
    return contractInstance.getProofs(proofType);
}

/**
 * Returns the information of some proof given its hash and type.
 * 
 * @param contractInstance instance of ProofsHandler smart contract.
 * @param proofHash hash identifying the given proof.
 * @param proofType type of the proof to be explored.
 */
export function getProofInformation(contractInstance, proofHash, proofType) {
    switch (proofType) {
        case proofTypes.dataWipe:
            return contractInstance.getDataWipeProofData(proofHash);
        case proofTypes.transfer:
            return contractInstance.getTransferProofData(proofHash);
        case proofTypes.function:
            return contractInstance.getFunctionProofData(proofHash);
        case proofTypes.reuse:
            return contractInstance.getReuseProofData(proofHash);
        case proofTypes.recycle:
            return contractInstance.getRecycleProofData(proofHash);
        default:
            break;
    }
}

export function getProofKeys(proofType: string): Array<string> {
    switch (proofType) {
        case proofTypes.dataWipe:
            return ['erasureType', 'date', 'erasureResult', 'proofAuthor'];
        case proofTypes.transfer:
            return ['supplier', 'receiver', 'deposit', 'isWaste'];
        case proofTypes.function:
            return ['score', 'diskUsage', 'algorithmVersion', 'proofAuthor'];
        case proofTypes.reuse:
            return ['receiverSegment', 'idReceipt', 'price'];
        case proofTypes.recycle:
            return ['collectionPoint', 'date', 'contact', 'ticket',
                'gpsLocation', 'recyclerCode'];
        default:
            break;
    }
}

export type Proof = {
    proofHash: string,
    proofType: string
}

export const proofTypes = {
    dataWipe: 'ProofDataWipe',
    transfer: 'ProofTransfer',
    function: 'ProoFunction',
    reuse: 'ProofReuse',
    recycle: 'ProofRecycling',
}