import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import { IContract } from "../lib/types"
import Contract from "../lib/contract"
import AppContext, { IAppContext } from "../components/app-context"
import Web3Wallet, { AccountState } from "../lib/web3-wallet"
import GeneralError from '../components/error'
import { getDeviceFactory, getERC20, getProofsHandler } from "../lib/deployment"
import { getTokens } from "../lib/erc20"
// TODO Add other contracts

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
    contracts: {},
    networkName: string,
    num_tokens: number

    // STATE SHARED WITH CHILDREN
    title: string,
}

class MainApp extends App<Props, State> {
    state: State = {
        provider: null,
        isConnected: false,
        accountState: AccountState.Unknown,
        address: null,
        contracts: {},
        title: "Explorer",
        networkName: null,
        num_tokens: 0
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
        try {
            // await window["ethereum"].enable()
            await Web3Wallet.connect();
            await Web3Wallet.unlock();
            const address = await Web3Wallet.getAddress();
            const provider = window["web3"].currentProvider
            const network = provider.networkVersion;
            const contracts = this.getContracts(network);
            let token_number = await getTokens(contracts.ERC20.contractInstance, address);
            this.setState({
                address: address,
                contracts: contracts,
                num_tokens: token_number.toNumber(),
                provider: provider,
                isConnected: true,
                networkName: network,
            });
        } catch (error) {
            console.error(error)
        }

    }

    getContracts(network) {
        const deviceFactory = getDeviceFactory(Web3Wallet.provider, network);
        const erc20 = getERC20(Web3Wallet.provider, network);
        const proofsHandler = getProofsHandler(Web3Wallet.provider, network);
        const dFactoryContract = new Contract("DeviceFactory", deviceFactory.address, deviceFactory);
        const erc20Contract = new Contract("EIP20", erc20.address, erc20);
        const pHandlersContract = new Contract("ProofsHandler", proofsHandler.address, proofsHandler);

        return {
            DeviceFactory: dFactoryContract,
            ERC20: erc20Contract,
            ProofsHandler: pHandlersContract
        };

    }

    componentWillUnmount() {
        clearInterval(this.refreshInterval)
    }

    // componentDidCatch(error: Error, _errorInfo: any/*ErrorInfo*/) {
    //     console.error(error)
    //     return <GeneralError />
    // }

    renderPleaseWait() {
        return null // The loading message will appear

        // return <div id="global-loading">
        //     <div><Spin size="small" /> &nbsp;Please, wait... </div>
        // </div>
    }


    render() {
        const address = this.state.address
        const contracts = this.state.contracts
        const tokens = this.state.num_tokens

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
                tokens: tokens,
                web3Wallet: Web3Wallet
            },
            contracts: contracts
        }


        return (
            <AppContext.Provider value={globalContext}>
                <Head>
                    <title>{this.state.title}</title>
                </Head>
                {/* <Layout> */}
                <Component {...this.state} />
                {/* </Layout> */}
            </AppContext.Provider>
        );
    }
}

export default MainApp