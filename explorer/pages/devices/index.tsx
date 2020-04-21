import { Component } from 'react'
import DeviceComponent from '../../components/device-component'
import ContractComponent from '../../components/contract-component'
import { getDeployedDevices } from '../../lib/devices'
import Link from "next/link"


// MAIN COMPONENT
const DevicesPage = (props) => {
  return (<DevicesView {...props} />)
}

type State = {
  contracts: object,
  address: string,
  devices: Array<string>,
  deviceId: string
}

// Stateful component
class DevicesView extends Component<State> {
  state: State = {
    contracts: {},
    address: null,
    devices: [],
    deviceId: null
  }

  constructor(props) {
    super(props);
  }

  async componentDidUpdate() {
    const params = location.hash.substr(2).split("/")
    let deviceId = null
    if (params)
      deviceId = params[0]
    if (deviceId != this.state.deviceId)
      this.setState({
        contracts: this.props.contracts,
        address: this.props.address,
        deviceId
      })
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

  updateDevices(contracts, address) {
    if (Object.keys(contracts).length > 0) {
      getDeployedDevices(contracts['DeviceFactory'].contractInstance, address).
        then(result => {
          this.setState({ devices: result })
        });
    }
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
              <ContractComponent key={k} {...contracts[k]} />
            )
          }
        </tbody>
      </table >
    );
  }

  renderDevices(devices) {
    let result = (<div></div>);
    if (devices.length > 0) {
      result = (
        <ul>
          {devices.map((item, index) => (
            <Link
              key={item}
              href={{ pathname: '/components/device-component', query: { deviceAddress: item } }}
              as={"/devices/" + item}>
              <a>
                <li>{item}</li>
              </a>
            </Link>
          ))}
        </ul>
      )
    }
    return result;
  }

  render() {
    this.updateDevices(this.props.contracts, this.props.address);
    let devicesRender = this.renderDevices(this.state.devices);
    let contractsRender = this.renderContracts(this.props.contracts);
    let deviceAddress = this.state.deviceId
    if (!deviceAddress)
      return (<div id="index">
        <div className="section">
          <h3>Contracts</h3>
          {contractsRender}

          <div className="section">
            <h2>Devices</h2>
            {devicesRender}
          </div>
        </div>
      </div>)
    else
      return <DeviceComponent {...deviceAddress = deviceAddress}></DeviceComponent>
  }
}

export default DevicesPage
