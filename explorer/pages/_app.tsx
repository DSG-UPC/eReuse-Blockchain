import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import { providers } from "ethers"
import { IContract } from "../lib/types"
import Contract from "../lib/contract"
import AppContext, { IAppContext } from "../components/app-context"
import Web3Wallet, { AccountState } from "../lib/web3-wallet"
import GeneralError from '../components/error'
import IndexPage from "./index"
import { getContractInstance } from "../lib/deployment"
import DeviceFactory from '../../build/contracts/DeviceFactory.json'

import "../styles/app.css";
// import { } from "../lib/types"
// import { isServer } from '../lib/util'

import "../styles/index.css"
import 'antd/lib/grid/style/index.css'
import 'antd/lib/list/style/index.css'
import 'antd/lib/form/style/index.css'
import 'antd/lib/pagination/style/index.css'
import 'antd/lib/skeleton/style/index.css'
import 'antd/lib/divider/style/index.css'
import 'antd/lib/message/style/index.css'
import 'antd/lib/button/style/index.css'
import 'antd/lib/menu/style/index.css'
import 'antd/lib/input/style/index.css'
import 'antd/lib/input-number/style/index.css'
import 'antd/lib/date-picker/style/index.css'
import 'antd/lib/spin/style/index.css'


type Props = {
    // injectedArray: any[],
}

type State = {
    provider: object
    isConnected: boolean,
    accountState: AccountState,
    address: string,
    contracts: IContract[],
    networkName: string,

    // STATE SHARED WITH CHILDREN
    title: string,
}

class MainApp extends App<Props, State> {
    state: State = {
        provider: null,
        isConnected: false,
        accountState: AccountState.Unknown,
        address: null,
        contracts: [],
        title: "Explorer",
        networkName: null
    }

    refreshInterval: any

    // static async getInitialProps(appContext) {
    //     // calls page's `getInitialProps` and fills `appProps.pageProps`
    //     const appProps = await App.getInitialProps(appContext)
    //
    //     // Fetch data and provide it on the first render
    //     const injectedArray = []
    //
    //     return { injectedArray, ...appProps }
    // }

    async componentDidMount() {
        // const provider = new $window.web3.providers.WebsocketProvider('ws://' + $window.CONSTANTS.blockchain + ':8545')
        // const web3 = new $window.web3(provider)
        // const web3wallet = new Web3Wallet()
        await Web3Wallet.connect()
        const address = await Web3Wallet.getAddress()
       
        const instance = await  getContractInstance(Web3Wallet.provider, DeviceFactory.networks[0].address, DeviceFactory)
        const contract  = new Contract("DeviceFactory", DeviceFactory.networks[0].address, instance)
        this.setState({address, contracts: [contract]})
        
    }

    componentWillUnmount() {
        clearInterval(this.refreshInterval)
    }

    // setTitle(title: string) {
    //     this.setState({ title })
    // }




    componentDidCatch(error: Error, _errorInfo: any/*ErrorInfo*/) {
        console.error(error)
        return <GeneralError />
    }

    renderPleaseWait() {
        return null // The loading message will appear

        // return <div id="global-loading">
        //     <div><Spin size="small" /> &nbsp;Please, wait... </div>
        // </div>
    }

    
    render() {
        const accountState = this.state.accountState
        const address = this.state.address
        const contracts = this.state.contracts

        // if (!this.state.isConnected) {
        //     return this.renderPleaseWait()
        // }
        // else if (Web3Wallet.isAvailable()) {
        //     if (accountState !== AccountState.Ok) {
        //         return this.renderMetamaskState()
        //     }
        // }

        // Main render

        const { Component, pageProps } = this.props

        // Get data from getInitialProps and provide it as the global context to children
        // const { injectedArray } = this.props

        const globalContext: IAppContext = {
            account: {
                address: address,
                tokens: 0,
                web3Wallet: Web3Wallet
            },
            contracts: contracts
        }


        return (
            <AppContext.Provider value={globalContext}>
                <Head>
                <title>Vocdoni Entities</title>
            </Head>
            {/* <Layout> */}
                <IndexPage {...pageProps} />
            {/* </Layout> */}
            </AppContext.Provider>
          );
    }
}

export default MainApp
