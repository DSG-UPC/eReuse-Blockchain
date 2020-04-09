import { useContext, Component } from 'react'
import AppContext, { IAppContext } from '../../components/app-context'
import Link from "next/link"
import { message, Button, Spin, Divider } from 'antd'


// MAIN COMPONENT
const DevicesPage = (props) => {
  // Get the global context and pass it to our stateful component
  const context = useContext(AppContext)
  console.log("Hi")
  console.log(context.contracts)
  console.log(context.account.address)
  return <DevicesView {...context} />
}


type State = {
  // connected?: boolean,
  // userAddress?: string,
  contracts: object
}

// Stateful component
class DevicesView extends Component<IAppContext, State> {
  state: State = {
    contracts: {}
  }

  async componentDidMount() {
    console.log("Ho")
    console.log(this.props.contracts)
    console.log(this.props.account.address)
    this.setState({contracts: this.props.contracts})

    // const context = useContext(AppContext)

    // try {
    //   let userAddress = null
    //   if (Web3Wallet.isEthereumAvailable() && Web3Wallet.isWeb3Available()) {
    //     this.setState({ connected: true })
    //     userAddress = await Web3Wallet.getAddress()


    //     this.setState({ userAddress })
    //   }
    // }
    // catch (err) {
    //   this.setState({ connected: false })
    //   if (err && err.message == "The given entity has no metadata defined yet") {
    //     return // nothing to show
    //   }
    //   console.log(err)
    //   message.error("Could not connect to the network")
    // }
  }

  renderUserInfo() {
    return <>
      <Divider />
      <h4>{"HEADER"}</h4>
      {/* <p>{this.context.account.address}</p> */}
      {/* <p><Link href={`/entities/edit/#/${this.state.entityId}`}><a><Button>Manage my entity</Button></a></Link></p> */}
    </>
  }

  renderGetStarted() {
    return <>
      <p>To login, install Metamask on your browser and try again.</p>
      <p><a href="https://metamask.io" target="_blank"><Button>Install Metamask</Button></a></p>
    </>
  }

  renderLoading() {
    return <div>Please, wait... <Spin size="small" /></div>
  }

  render() {
    const props = this.props
    let contracts
    console.log(this.props) 
    console.log(Object.keys(this.props.contracts).length)
    // const contracts = this.state.contracts
    if (Object.keys(this.props.contracts).length > 0 )
      contracts = <div id="test">
        {this.props.contracts[Object.keys(this.props.contracts)[0]].address}
      </div>
    else
      contracts = <div id="test"></div>

    return <div id="index">
      <div className="card">
        <h3>Usody</h3>
        {props.account.address}
        {contracts}
      
        
        {/* 
        {
          this.state.connected ? this.renderLoading() :
            (this.state.userAddress ? this.renderUserInfo() : this.renderGetStarted())
        } */}

        <div>
          <h1> Example</h1>
          <p>
            Examples of how to get started with Drizzle in various situations.
        </p>
        </div>

        <div className="section">
          <h2>Active Account</h2>
           {JSON.stringify(this.props.account)}
        </div>

        <div className="section">
          <h2>DAO</h2>
          <p>
            This shows a simple ContractData component with no arguments, along
            with a form to set its value.
        </p>
          <p>
            <strong>Stored Value: </strong>
          </p>
        </div>
      </div>
    </div>
  }
}

// // Custom layout example
// IndexPage.Layout = props => <MainLayout>
//   {props.children}
// </MainLayout>

export default DevicesPage
