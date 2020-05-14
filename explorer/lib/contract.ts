import { Address, Instance, Abi } from './types'


export type Contracts = {[k in string]: IContract}
export type IContract = InstanceType<typeof Contract>
// export interface IContract {
//     //     abi: string,
//     //     address: string,
//     //     contractName: string,
//     //     contractArtifact: object,
//     //     events: Array
//     // }

class Contract {
    // abi: string
    address: Address
    contractName: string
    contractInstance: Instance
    events: []
    // events : {}[]
    constructor(
        // web3Contract,
        name,
        // events = [],
        address,
        contractInstance = null
    ) {
        // this.abi = web3Contract.options.jsonInterface
        // this.address = web3Contract.options.address
        this.address = address
        this.contractName = name
        this.contractInstance = contractInstance
        // this.contractArtifact = contractArtifact
        // this.events = events
    }
}



export default Contract
