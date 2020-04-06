import { IContract } from "./types"
import { Component } from 'react'
import contract from 'truffle-contract'



//  interface IContract {
//     contract: string,
//     method: string,
//     methodArgs?: [],
//     hideIndicator?: boolean,
//     toUtf8?: boolean,
//     toAscii?: boolean,
//     render?: () => any,
// }

class Contract {
    // abi: string
    address: string
    contractName: string
    contractInstance: {}
    // events : {}[]
    constructor (
        // web3Contract,
        name,
        // events = [],
        address,
        contractInstance = {}
    ) {
        // this.abi = web3Contract.options.jsonInterface
        // this.address = web3Contract.options.address
        this.address = address
        this.contractName = name
        this.contractInstance =  contractInstance
        // this.contractArtifact = contractArtifact
        // this.events = events
    }
}

  

export default Contract
