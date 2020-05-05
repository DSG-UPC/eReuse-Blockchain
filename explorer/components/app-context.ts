import { createContext} from 'react'
import { Provider, Address } from "../lib/types"
import { AccountState } from "../lib/web3-wallet"


export interface IAppContext {
    // globalState: IGlobalState,

    provider: Provider
    isConnected: boolean,
    accountState: AccountState,
    address: Address,
    contracts: {},
    networkName: string,
    num_tokens: number
}

// Global context provided to every page
const AppContext = createContext<IAppContext>(null)

export default AppContext
