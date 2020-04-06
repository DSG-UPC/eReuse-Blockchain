// NEWS FEED

let proof : IProof = {
    proofId: "a"
}

export interface IProof {
   proofId: number,
}


export interface IConnection {
    provider: object,
}


export interface IAccount{
    address: string,
    tokens: number,
    web3Wallet: object,
}


export interface IContract {
    abi : string,
    address: string,
    contractName: string,
    contractArtifact: object,
    events : Array
}