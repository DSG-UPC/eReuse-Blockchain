import { Component } from 'react'
import { Button, Spin, Divider, List, Avatar } from 'antd'
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
          this.updateProofs(result)
          this.setState({ devices: result })
        });
    }
  }

  updateProofs(devices) {
    if (devices.length > 0) {
      let currentProofs = {};
      devices.map(async (item, index) => {
        let contractInstance = await getDepositDevice(this.props.provider, this.props.networkName, item)
        await Object.keys(this.state.proofs).map(async (proofType, index) => {
          await getProofsFromDevice(contractInstance, proofType)
            .then(proofs => {
              currentProofs[proofType] = proofs;
            })
          this.setState({ proofs: currentProofs })
        })
      })
    }
  }

  async componentDidUpdate(prevprops: IAppContext) {
    if (prevprops.contracts && prevprops.contracts != this.props.contracts) {
      await this.updateDevices(this.props.contracts);
    }
  }

  async componentDidMount() {
    await this.updateDevices(this.props.contracts);
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

  renderProofs() {
    return (
      <div className="body-card">
        <h2>Proofs</h2>
        <div id="proof-types-list" >
          <List
            className="list"
            itemLayout="vertical"
            dataSource={Object.keys(this.state.proofs)}
            renderItem={item => (
              <List.Item  >
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#87d068' }}>{item.replace(/[a-z]/g, '')}</Avatar>}
                  // avatar={<Avatar style={{ backgroundColor: '#87d068' }}>{ item. Array(item).filter(i=> item.toUpperCase().indexOf(i)>-1)}</Avatar>}
                  title={item}
                  description={`Set of ${item} Proofs`}
                />
                {this.renderProofType(item)}
              </List.Item>
            )}
          />
        </div>
      </div>
    )
  }

  renderProofType(proofType: string) {
    let result = (<div></div>);
    const proofs = this.state.proofs;
    if (proofs && proofs[proofType] && proofs[proofType].length > 0) {
      const data: string[] = proofs[proofType]
      console.log(data)
      result = (
        <div id='proofs-list'>
          <List
            className="list"
            itemLayout="vertical"
            dataSource={data}
            renderItem={item => (
              <List.Item
              // actions={[<a key="list-loadmore-edit">show</a>, <a key="list-loadmore-more">more</a>]}
              >
                {/* <Skeleton avatar title={false}> */}
                <List.Item.Meta
                  title={<Link
                    href="/proofs/[item]/"
                    as={`/proofs/${proofType}/${item}`}>
                    <a>{item}</a>
                  </Link>
                  }
                description=""
                />
              </List.Item>
            )}
          /></div>)
    }
    return result;
  }

  render() {
    return (
      <div id="page-body">
        {this.renderProofs()}
      </div>
    )
  }
}

// // Custom layout example
// IndexPage.Layout = props => <MainLayout>
//   {props.children}
// </MainLayout>

export default ProofsPage
