import { Component } from 'react'
import DeviceComponent from '../../components/device-component'
import ContractComponent from '../../components/contract-component'
import { Button, Spin, Divider } from 'antd'
import { getDeployedDevices } from '../../lib/devices'
import Router from 'next/router'
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

  async componentDidMount() {
    // const params = location.hash.substr(2).split("/")
    // let deviceId = null
    // if (params)
    //   deviceId = params[0]
    // console.log(deviceId)
    // if (deviceId != this.state.deviceId)
    //   this.setState({
    //     contracts: this.props.contracts,
    //     address: this.props.address,
    //     deviceId
    //   })
    // Router.push(location)

  }

  async componentDidUpdate() {
    const params = location.hash.substr(2).split("/")
    let deviceId = null
    if (params)
      deviceId = params[0]
    // console.log(deviceId)
    if (deviceId != this.state.deviceId)
      this.setState({
        contracts: this.props.contracts,
        address: this.props.address,
        deviceId
      })
  }

  renderTableHeader() {
    return (<tr>
      <th className="centering">Contract Name</th>
      <th className="centering">Contract Address</th>
    </tr>);
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
        {(keys.length > 0) &&
          keys.map((k, index) =>
            <ContractComponent key={k} {...contracts[k]} />
          )
        }
      </table>
    );
  }

  renderDevices(devices) {
    let result = (<div></div>);
    if (devices.length > 0) {
      result = (
        <ul>
          {devices.map((item, index) => (
            <Link href={"/devices/#/" + item}>
              <a><li>{item}</li></a>
            </Link>
          ))}
        </ul>
      )
    }
    return result;
  }

  render() {
    this.updateDevices(this.props.contracts, this.props.address);
    let contractsRender = this.renderContracts(this.props.contracts);
    let devicesRender = this.renderDevices(this.state.devices);
    let deviceAddress = this.state.deviceId
    if (!deviceAddress)
      return <div id="index">
        <div className="section">
          <h3>Contracts</h3>
          {contractsRender}

          <div className="section">
            <h2>Devices</h2>
            {devicesRender}
          </div>
        </div>
      </div>
    else
      return <DeviceComponent {...deviceAddress = deviceAddress}></DeviceComponent>
  }
}

export default DevicesPage
