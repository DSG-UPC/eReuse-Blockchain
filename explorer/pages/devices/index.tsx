import { Component } from 'react'
import ContractComponent from '../../components/contract-component'
import { getDeployedDevices } from '../../lib/devices'
import Link from "next/link"
import AppContext, { IAppContext } from '../../components/app-context'
import { Divider, Menu, List, Avatar, Skeleton } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Address } from '../../lib/types'
import { IContract, Contracts } from '../../lib/contract'


// MAIN COMPONENT
const DevicesPage = (props) => {
  return (
    <AppContext.Consumer>
      {context => <DevicesView {...context} />}
    </AppContext.Consumer>
  )
}

type State = {
  contracts: Contracts,
  address: Address,
  devices: Array<Address>,
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

  async updateDevices(contracts, address: Address) {
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

  renderDevices(devices: string[]) {
    let result = (<div></div>)
    console.log(devices)
    if (devices.length > 0) {
      result = (
        <List
          className="list"
          itemLayout="vertical"
          dataSource={devices}
          renderItem={item => (
            <List.Item
            // actions={[<a key="list-loadmore-edit">show</a>, <a key="list-loadmore-more">more</a>]}
            >
              {/* <Skeleton avatar title={false}> */}
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#87d068' }}>{item.slice(item.length - 2)}</Avatar>}
                title={<Link href="/devices/[item]"
                  as={"/devices/" + item}>
                  <a>{item}</a>
                </Link>
                }
                description="Info for ..."
              />
              {/* <div>content</div> */}
              {/* </Skeleton> */}
            </List.Item>
          )}
        />
      )
    }
    return result;
  }

  render() {

    // let devicesRender = this.renderDevices(this.state.devices);
    // let contractsRender = this.renderContracts(this.props.contracts);
    return (
      <div id="page-body">
        {/* <div className="section">
          <h3>Contracts</h3>
          {contractsRender} */}

        <div className="body-card">
          <h2>Devices</h2>
          {this.renderDevices(this.state.devices)}
        </div>
        {/* </div> */}
      </div>
    )
  }
}

export default DevicesPage
