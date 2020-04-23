import { Component } from 'react'
import { Button, Spin, Divider } from 'antd'
import { getDeployedDevices } from '../../lib/devices'
import { getDepositDevice } from "../../lib/deployment"
import AppContext, { IAppContext } from '../../components/app-context'
import Link from "next/link"
import { getProofsFromDevice } from '../../lib/proofs'

const contractName = "FunctionProofs"

// MAIN COMPONENT
const ProofsPage = (props) => {
  return <ProofsView {...props} />
}

type State = {
  contracts: object,
  address: string,
  proofs: Object,
  devices: Array<string>
}

// Stateful component
class ProofsView extends Component<IAppContext, State> {
  state: State = {
    contracts: {},
    address: null,
    proofs: {
      'ProofDataWipe': [],
      'ProofTransfer': [],
      'ProofFunction': [],
      'ProofReuse': [],
      'ProofRecycle': []
    },
    devices: []
  }

  constructor(props) {
    super(props);
  }

  async updateDevices(contracts) {
    if (Object.keys(contracts).length > 0) {
      getDeployedDevices(contracts['DeviceFactory'].contractInstance,
        this.props.address).
        then(result => {
          this.setState({ devices: result })
        });
    }
  }

  async updateProofs() {
    if (Object.keys(this.state.devices).length > 0) {
      let currentProofs = {};
      await this.state.devices.map(async (item, index) => {
        let contractInstance = await getDepositDevice(this.props.provider, this.props.networkName, item)
        await Object.keys(this.state.proofs).map(async (item, index) => {
          currentProofs[item] = await getProofsFromDevice(contractInstance, item)
        })
        this.setState({ proofs: currentProofs })
      })
    }
  }

  async componentDidUpdate(prevprops: IAppContext) {
    if (prevprops.contracts && prevprops.contracts != this.props.contracts) {
      await this.updateDevices(this.props.contracts);
    }
    if (this.state.devices.length > 0) {
      await this.updateProofs();
    }
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

  renderProofs(proofType) {
    let result = (<div></div>);
    const proofs = this.state.proofs;
    if (this.state.proofs && this.state.proofs[proofType].length > 0) {
      result =
        <ul>
          {proofs[proofType].map((proof, index) => (
            <li key={proof}>
              <Link
                href="/proofs/[item]"
                as={`/proofs/${proofType}/${proof}`}>
                <a>{proof}</a>
              </Link>
            </li>
          ))}
        </ul>
    }
    return result;
  }

  render() {
    return (
      <div id="index">
        <div className="card">
          <h3>Usody</h3>
          <div key="proofs-div" className="section">
            <h2>Proofs</h2>
            {
              Object.keys(this.state.proofs).map((item, index) => (
                [<h3 key={item}>{item}</h3>, this.renderProofs(item)]
              ))
            }
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
