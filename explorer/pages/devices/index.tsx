import { Component } from 'react'
import ContractComponent from '../../components/contract-component'
import { getDeployedDevices } from '../../lib/devices'
import Link from "next/link"
import AppContext, { IAppContext } from '../../components/app-context'


// MAIN COMPONENT
const DevicesPage = (props) => {
  return (
    <AppContext.Consumer>
      {context => <DevicesView {...context} />}
    </AppContext.Consumer>
  )
}

type State = {
  contracts: object,
  address: string,
  devices: Array<string>,
  deviceId: string
}

// Stateful component
class DevicesView extends Component<IAppContext, State> {
  state: State = {
    contracts: {},
    address: null,
    devices: [],
    deviceId: null
  }

  constructor(props) {
    super(props);
  }


  async componentDidMount() {
    console.log("Device Props", this.props)
    await this.updateDevices(this.props.contracts, this.props.address);
  }

  async componentDidUpdate(prevprops: IAppContext) {
    if (prevprops.contracts && prevprops.contracts != this.props.contracts) {
      await this.updateDevices(this.props.contracts, this.props.address);
    }
  }

  async updateDevices(contracts, address) {
    if (Object.keys(contracts).length > 0) {
      getDeployedDevices(contracts['DeviceFactory'].contractInstance, address).
        then(result => {
          console.log(result)
          this.setState({ devices: result })
        });
    }
  }

  renderTableHeader() {
    return (
      <thead>
        <tr>
          <th className="centering">Contract Name</th>
          <th className="centering">Contract Address</th>
        </tr>
      </thead>);
  }


  renderContracts(contracts) {
    const keys = Object.keys(contracts).slice();
    return (
      <table>
        {this.renderTableHeader()}
        <tbody>
          {
            (keys.length > 0) &&
            keys.map((k, index) =>
              <ContractComponent key={index} {...contracts[k]} />
            )
          }
        </tbody>
      </table >
    );
  }

  renderDevices(devices) {
    let result = (<div></div>)
    console.log(devices)
    if (devices.length > 0) {
      result = (
        <ul>
          {devices.map((item, index) => (
            <li key={index}>
              <Link
                href="/devices/[item]"
                as={"/devices/" + item}>
                <a>{item}</a>
              </Link>
            </li>
          ))}
        </ul>
      )
    }
    return result;
  }

  render() {

    let devicesRender = this.renderDevices(this.state.devices);
    let contractsRender = this.renderContracts(this.props.contracts);
    return (
      <div id="index">
        <div className="section">
          <h3>Contracts</h3>
          {contractsRender}

          <div className="section">
            <h2>Devices</h2>
            {devicesRender}
          </div>
        </div>
      </div>
    )
  }
}

export default DevicesPage
