import { Component } from 'react'
import Contract from '../../lib/contract'
import { getDeviceInformation, DeviceInfo } from "../../lib/devices"
import { getDepositDevice } from "../../lib/deployment"
import AppContext, { IAppContext } from '../../components/app-context';

export default function DeviceView(props) {
    return <AppContext.Consumer>
        {context => <DeviceComponent {...context} />}
    </AppContext.Consumer>

}

type State = {
    contract: Contract
    properties: DeviceInfo
}

class DeviceComponent extends Component<IAppContext, State> {

    state: State = {
        contract: null,
        properties: {} as DeviceInfo
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        console.log(location)
        console.log(location.pathname)
        console.log(location.pathname.trim().split('/'))
        const deviceAddress = location.pathname.trim().split('/')[2]
        console.log(this.props)
        if (deviceAddress) {
            let contractInstance = await getDepositDevice(this.props.provider, this.props.networkName, deviceAddress)
            console.log(contractInstance)
            let contract: Contract = new Contract('DepositDevice', deviceAddress, contractInstance)
            const properties = await getDeviceInformation(contractInstance)
            this.setState({
                contract,
                properties
            })
        }
    }

    renderObjectProperties() {
        let properties = this.state.properties
        console.log(properties)
        return Object.keys(properties).map((key, index) => {
            return <li key={index}>{key + ": " + properties[key]}</li>
        })
    }

    render() {
        let contractRender = []
        contractRender.push(<p></p>)
        const contract = this.state.contract
        if (contract && this.state.properties) {
            contractRender.push(<h2>{contract.address}</h2>)
            contractRender.push(<ul>{this.renderObjectProperties()}</ul>)

        }
        return (
            <div className="contractMain">
                {contractRender}
            </div>
        );
    }
}
