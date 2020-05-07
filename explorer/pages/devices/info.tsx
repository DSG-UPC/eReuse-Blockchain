import { Component } from 'react'
import Contract, {IContract} from '../../lib/contract'
import { getDeviceInformation, DeviceInfo, hasDeviceProofs } from "../../lib/devices"
import { getDepositDevice } from "../../lib/deployment"
import AppContext, { IAppContext } from '../../components/app-context'
import {  List } from 'antd'
import Router from 'next/router'
// const router  = useRouter()

export default function DeviceView(props) {
    return <AppContext.Consumer>
        {context => <DeviceComponent {...context} />}
    </AppContext.Consumer>

}

type State = {
    contract: IContract
    properties: DeviceInfo
    hasProofsRecycling: boolean
}

class DeviceComponent extends Component<IAppContext, State> {
    state: State = {
        contract: null,
        properties: {} as DeviceInfo,
        hasProofsRecycling: false
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        console.log("Router"+JSON.stringify(Router.query))
        const deviceAddress = Router.query.device as string
        console.log(this.props)
        if (deviceAddress) {
            let contractInstance = await getDepositDevice(this.props.provider, this.props.networkName, deviceAddress)
            const hasProofsRecycling = await hasDeviceProofs(contractInstance, 'ProofRecycling');
            let contract: Contract = new Contract('DepositDevice', deviceAddress, contractInstance)
            const properties = await getDeviceInformation(contractInstance)
            this.setState({
                contract,
                properties,
                hasProofsRecycling
            })
        }
    }

    renderObjectProperties() {
        let properties = this.state.properties
        properties['hasProofsRecycling'] = this.state.hasProofsRecycling.toString();
        // return Object.keys(properties).map((key, index) => {
        //     return <li key={key}>{key + ": " + properties[key]}</li>
        // })
        return (
            <div className="body-card">
                <List
                    className="list"
                    itemLayout="vertical"
                    dataSource={Object.keys(properties)}
                    renderItem={item => (
                        <List.Item
                        // actions={[<a key="list-loadmore-edit">show</a>, <a key="list-loadmore-more">more</a>]}
                        >
                            {/* <Skeleton avatar title={false}> */}
                            <List.Item.Meta
                                title={item}
                            // description="Info for ..."
                            />
                            {properties[item]}
                        </List.Item>
                    )}
                />
            </div>
        )
    }

    render() {
        let contractRender = []
        const contract = this.state.contract
        if (contract && this.state.properties) {
            contractRender.push(<h2 key={contract.address}>{contract.address}</h2>)
            contractRender.push(<ul key={this.state.properties.uid}>{this.renderObjectProperties()}</ul>)
        }
        return (
            <div className="page-body">
                {contractRender}
            </div>
        );
    }
}
