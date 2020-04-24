// NEWS FEED

export interface IProof {
    proofHash: string,
    proofType: string
}

export interface IProofDataWipe {
    erasureType: string,
    date: string,
    erasureResult: bool,
    proofAuthor: string
}

export interface IProofFunction {
    score: number,
    diskUsage: number,
    algorithmVersion: string
    proofAuthor: string,
}

export interface IProofTransfer {
    supplier: string,
    receiver: string,
    deposit: number,
    isWaste: bool
}

export interface IProofReuse {
    receiverSegment: string,
    idReceipt: string,
    price: number
}

export interface IProofRecycling {
    collectionPoint: string,
    date: string,
    contact: string,
    ticket: string,
    gpsLocation: string,
    recyclerCode: string
}

export interface IConnection {
    provider: object,
}


export interface IAccount {
    address: string,
    tokens: number,
    web3Wallet: object,
}


export interface IContract {
    abi: string,
    address: string,
    contractName: string,
    contractArtifact: object,
    events: Array
}