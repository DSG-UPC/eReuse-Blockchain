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

    async componentDidMount() {
        try {
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
        clearInterval(this.refreshInterval);
    }

    renderPleaseWait() {
        return null;
    }


    render() {
        const address = this.state.address
        const contracts = this.state.contracts
        const tokens = this.state.num_tokens

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
                <Component {...this.state} />
            </AppContext.Provider>
        );
    }
}

export default MainApp