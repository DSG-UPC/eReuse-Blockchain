import { Instance } from "./types";

/**
 * Auxiliary function to create an instance of some smart contract
 * whose address is known.
 * @param {Function} contractInstance Instance of DeviceFactory smart contract.
 * @param {string} ownerAddress String representation of the Ethereum
 *                                 address of the owner.
 * @returns {Promise} A promise which resolves to the the devices owned by user.
 */
export function getProofsFromDevice(contractInstance: Instance, proofType: ProofType): Promise<string[]> {
    return contractInstance.getProofs(proofType);
}

/**
 * Returns the information of some proof given its hash and type.
 * 
 * @param contractInstance instance of ProofsHandler smart contract.
 * @param proofHash hash identifying the given proof.
 * @param proofType type of the proof to be explored.
 */
export function getProofInformation(contractInstance, proof: ProofID): Proof {
    switch (proof.type) {
        case 'ProofDataWipe':
            return contractInstance.getDataWipeProofData(proof.hash);
        case 'ProofTransfer':
            return contractInstance.getTransferProofData(proof.hash);
        case 'ProofFunction':
            return contractInstance.getFunctionProofData(proof.hash);
        case 'ProofReuse':
            return contractInstance.getReuseProofData(proof.hash);
        case 'ProofRecycling':
            return contractInstance.getRecycleProofData(proof.hash);
        default:
            break;
    }
}

export async function hasDeviceProofs(contractInstance): Promise<string> {
    return await contractInstance.isRecycled.call()
}


export type ProofType = 'ProofDataWipe' | 'ProofTransfer' | 'ProofFunction' | 'ProofReuse' | 'ProofRecycling'
export type Proof = ProofDataWipe | ProofTransfer | ProofFunction | ProofReuse | ProofRecycling
export type ProofAttribute = 'erasureType' | 'date' | 'erasureResult' | 'proofAuthor' |
    'supplier' | 'receiver' | 'deposit' | 'isWaste' |
    'score' | 'diskUsage' | 'algorithmVersion' |
    'receiverSegment' | 'idReceipt' | 'price' |
    'collectionPoint' | 'contact' | 'ticket' | 'gpsLocation' | 'recyclerCode'

export interface ProofID {
    hash: string,
    type: ProofType
}

export interface ProofDataWipe {
    erasureType: string,
    date: string,
    erasureResult: boolean,
    proofAuthor: string,
    diskSN: string
}

export interface ProofFunction {
    score: number,
    diskUsage: number,
    algorithmVersion: string
    proofAuthor: string,
    diskSN: string
}

export interface ProofTransfer {
    supplier: string,
    receiver: string,
    deposit: number,
    isWaste: boolean
}

export interface ProofReuse {
    receiverSegment: string,
    idReceipt: string,
    price: number
}

export interface ProofRecycling {
    collectionPoint: string,
    date: string,
    contact: string,
    ticket: string,
    gpsLocation: string,
    recyclerCode: string
}

export const proofTypes = ['ProofDataWipe', 'ProofTransfer', 'ProofFunction', 'ProofReuse', 'ProofRecycling']

export const proofTypeAttributes = {
    'ProofDataWipe': ['erasureType', 'date', 'erasureResult', 'proofAuthor', 'diskSN'],
    'ProofTransfer': ['supplier', 'receiver', 'deposit', 'isWaste'],
    'ProofFunction': ['score', 'diskUsage', 'algorithmVersion', 'proofAuthor', 'diskSN'],
    'ProofReuse': ['receiverSegment', 'idReceipt', 'price'],
    'ProofRecycling': ['collectionPoint', 'date', 'contact', 'ticket',
        'gpsLocation', 'recyclerCode']
}

export const errorHash = '0x0000000000000000000000000000000000000000000000000000000000000000'


// export type ProofDataWipe = {
//     'erasureType': string
//     'date': string
//     'erasureResult': string
//     'proofAuthor': string
// }

// export type ProofTran

// export const proofTypes = {
//     dataWipe: 'ProofDataWipe',
//     transfer: 'ProofTransfer',
//     function: 'ProofFunction',
//     reuse: 'ProofReuse',
//     recycle: 'ProofRecycling',
// }

