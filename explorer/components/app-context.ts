import { createContext} from 'react'
import { IContract, IAccount } from "../lib/types"


export interface IAppContext {
    // globalState: IGlobalState,

    account: IAccount,
    contracts: {},
}

// Global context provided to every page
const AppContext = createContext<IAppContext>(null)

export default AppContext
