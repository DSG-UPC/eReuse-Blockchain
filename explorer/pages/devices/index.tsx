import { Component } from 'react'
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
    let result = (<div></div>);
    const keys = Object.keys(contracts);
    if (keys.length > 0) {
      result = <div>
        {keys.map(k => {
          (<p key={k}>{k}</p>);
        })}
      </div>;
    }
    return result;
  }

  renderDevices(devices) {
    let result = (<div></div>);
    result = (
      <div>
        {devices.map((item, index) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    )
    return result;
  }

  render() {
    const contracts = this.props.contracts;
    const address = this.props.address;

    this.updateDevices(contracts, address);
    let contractsRender = this.renderContracts(contracts);
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
