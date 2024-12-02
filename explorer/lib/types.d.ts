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

export interface IConnection {
    provider: object,
}

export interface IAccount {
    address: string,
    tokens: number,
    web3Wallet: object,
}