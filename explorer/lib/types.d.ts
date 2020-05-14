import  { providers, ethers } from 'ethers'
// import TruffleContract  from '@truffle/contract'
import { Abi } from '@truffle/contract-schema'
import { Contract} from './contract'

export type Address = string
export type Provider =  providers.Web3Provider 
export type Instance = ethers.Contract // | 
export type Abi = Abi
// export type abi = ethers.Contract.
// type abi?
// tyep

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