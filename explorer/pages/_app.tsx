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
import AppLayout from "../components/layout"
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
// import { Layout } from 'antd'

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

    async componentDidMount() {
        try {
            await Web3Wallet.unlock();
            await this.refreshStatus()
            // setContext()
            this.refreshInterval = setInterval(() => { }, 35000)
        } catch (error) {
            console.error(error)
        }

    }

    // async componentDidUpdate() {
    //     try {
    //         await this.refreshStatus()
    //         // setContext()
    //         // this.refreshInterval = setInterval(() => { }, 35000)
    //     } catch (error) {
    //         console.error(error)
    //     }

    // }

    async refreshStatus() {
        await Web3Wallet.connect();
        const address = await Web3Wallet.getAddress()
        // const provider = window["web3"].currentProvider
        const provider = Web3Wallet.provider
        // const network = provider.networkVersion;
        const network = (await provider.getNetwork())
        const networkName = String(network.chainId)
        // const contracts = this.getContracts(network);
        const contracts = this.getContracts(networkName);
        let token_number = await getTokens(contracts.ERC20.contractInstance, address);
        this.setState({
            address: address,
            contracts: contracts,
            num_tokens: token_number.toNumber(),
            provider: provider,
            isConnected: true,
            networkName: networkName,
        });
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
        clearInterval(this.refreshInterval);
    }

    renderPleaseWait() {
        return null;
    }


    render() {
        const address = this.state.address
        const contracts = this.state.contracts
        const tokens = this.state.num_tokens
        console.log("App State", this.state);
        // Main render

        const { Component, pageProps, router } = this.props
        router.pathname

        // Get data from getInitialProps and provide it as the global context to children
        // const { injectedArray } = this.props

        // const globalContext: IAppContext = {
        //     account: {
        //         address: address,
        //         tokens: tokens,
        //         web3Wallet: Web3Wallet
        //     },
        //     contracts: contracts
        // }


        return (
            <AppContext.Provider value={this.state}>
                <Head>
                    <title>{this.state.title}</title>
                </Head>
                <AppLayout location={router.pathname}>
                    <Component {...this.state} />
                </AppLayout>
            </AppContext.Provider>
        );
    }
}

export default MainApp