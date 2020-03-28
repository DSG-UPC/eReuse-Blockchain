import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import { IAppContext } from "../components/app-context"
import Web3Wallet, { AccountState } from "../lib/web3-wallet"
import MetamaskState from '../components/metamask-state'
import GeneralError from '../components/error'
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "../lib/drizzleOptions";
import Index from "./index";
// import MyComponent from "./MyComponent";
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

const drizzle = new Drizzle(drizzleOptions);

type Props = {
    // injectedArray: any[],
}

type State = {
    isConnected: boolean,
    accountState: AccountState,
    networkName: string,

    // STATE SHARED WITH CHILDREN
    title: string,
}

class MainApp extends App<Props, State> {
    state: State = {
        isConnected: false,
        accountState: AccountState.Unknown,
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

    componentDidMount() {
    
        // this.refreshInterval = setInterval(() => this.refreshStatus(), 3500)
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

    renderMetamaskState() {
        return <div>
            <MetamaskState accountState={this.state.accountState} />
        </div>
    }

    render() {
        const accountState = this.state.accountState

        if (!this.state.isConnected) {
            return this.renderPleaseWait()
        }
        else if (Web3Wallet.isAvailable()) {
            if (accountState !== AccountState.Ok) {
                return this.renderMetamaskState()
            }
        }

        // Main render

        const { Component, pageProps } = this.props

        // Get data from getInitialProps and provide it as the global context to children
        // const { injectedArray } = this.props

        // const injectedGlobalContext: IAppContext = {
        //     title: this.state.title,
        //     setTitle: (title) => this.setTitle(title),
        //     onGatewayError: this.onGatewayError
        // }


        return (
            <DrizzleContext.Provider drizzle={drizzle}>
              <DrizzleContext.Consumer>
                {drizzleContext => {
                  const { drizzle, drizzleState, initialized } = drizzleContext;
        
                  if (!initialized) {
                    return "Loading..."
                  }
        
                  return (
                    <Index {...pageProps} drizzle={drizzle} drizzleState={drizzleState} />
                  )
                }}
              </DrizzleContext.Consumer>
            </DrizzleContext.Provider>
          );
    }
}

export default MainApp
