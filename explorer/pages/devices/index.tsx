import { Component } from 'react'
import ContractComponent from './ContractComponent'
import { Button, Spin, Divider } from 'antd'
import { getDeployedDevices } from '../../lib/devices'


// MAIN COMPONENT
const DevicesPage = (props) => {
  return (<DevicesView {...props} />)
}

type State = {
  contracts: object,
  address: string,
  devices: Array<string>
}

// Stateful component
class DevicesView extends Component<State> {
  state: State = {
    contracts: {},
    address: null,
    devices: []
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

  updateDevices(contracts, address) {
    if (Object.keys(contracts).length > 0) {
      getDeployedDevices(contracts['DeviceFactory'].contractInstance, address).
        then(result => {
          this.setState({ devices: result })
        });
    }
  }

  renderContracts(contracts) {
    let result = <div></div>;
    const keys = Object.keys(contracts).slice();
    if (keys.length > 0) {
      result = (<div>
        {keys.map((k, index) =>
          <ContractComponent key={k} {...contracts[k]} />
        )}
      </div>);
    }
    return result;
  }

  renderDevices(devices) {
    let result = (<div></div>);
    if (devices.length > 0) {
      result = (
        <div>
          {devices.map((item, index) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      )
    }
    return result;
  }

  render() {
    this.updateDevices(this.props.contracts, this.props.address);
    let contractsRender = this.renderContracts(this.props.contracts);
    let devicesRender = this.renderDevices(this.state.devices);

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
  }
}

export default DevicesPage
