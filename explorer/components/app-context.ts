import { createContext} from 'react'
import { IContract, IAccount } from "../lib/types"
import { AccountState } from "../lib/web3-wallet"


export interface IAppContext {
    // globalState: IGlobalState,

    provider: object
    isConnected: boolean,
    accountState: AccountState,
    address: string,
    contracts: {},
    networkName: string,
    num_tokens: number
}

// Global context provided to every page
const AppContext = createContext<IAppContext>(null)

export default AppContext
