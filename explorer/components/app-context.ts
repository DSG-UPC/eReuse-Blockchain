import { createContext } from 'react'
import { newContextComponents } from "@drizzle/react-components"

const {AccountData, ContractData, ContractForm } = newContextComponents

export interface IAccountDataContext {
    drizzle: object,
    drizzleState: object,
    accountIndex:number,
    units?: string,
    precision?: number,
    render?: () => any,
}


export interface IContractDataContext {
    drizzle: object,
    drizzleState: object,
    contract: string,
    method: string,
    methodArgs?: [],
    hideIndicator?: boolean,
    toUtf8?: boolean,
    toAscii?: boolean,
    render?: () => any,
}

export interface IContractFormContext {
    drizzle: object,
    contract: string,
    method: string,
    sendArgs?: object,
    labels?: string[],
    render?: () => any,
}


export interface IAppContext {
    AccountData: IAccountDataContext,
    ContractData: IContractDataContext,
    ContractForm: IContractFormContext


}

// Global context provided to every page
const AppContext = createContext<IAppContext>({AccountData, ContractData, ContractForm})

export default AppContext
