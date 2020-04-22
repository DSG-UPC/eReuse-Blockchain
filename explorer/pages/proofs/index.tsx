import { Component } from 'react'
import { Button, Spin, Divider } from 'antd'

const contractName = "FunctionProofs"

// MAIN COMPONENT
const ProofsPage = (props) => {
  return <ProofsView {...props} />
}

type State = {
  contracts: object,
  address: string,
  proofs: Array<string>
}

// Stateful component
class ProofsView extends Component<State> {
  state: State = {
    contracts: {},
    address: null,
    proofs: []
  }

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.setState({
      contracts: this.props.contracts,
      address: this.props.address
    })
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

  updateProofs(contracts, address) {
    if (Object.keys(contracts).length > 0) {
      // getDeployedDevices(contracts['DeviceFactory'].contractInstance, address).
      //   then(result => {
      //     this.setState({ devices: result })
      //   });
    }
  }

  renderProofs(proofs) {
    let result = (<div></div>);
    result = (
      <div>
        {proofs.map((item, index) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    )
    return result;
  }

  render() {
    this.updateProofs(this.state.contracts, this.state.address);
    const proofsRender = this.renderProofs(this.state.proofs);
    return (
      <div id="index">
        <div className="card">
          <h3>Usody</h3>

          <div className="section">
            <h2>Devices</h2>
            {proofsRender}
          </div>

        </div>
      </div>
    )
  }
}

// // Custom layout example
// IndexPage.Layout = props => <MainLayout>
//   {props.children}
// </MainLayout>

export default ProofsPage
