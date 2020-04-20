import { Component } from 'react'
import { IContract } from '../lib/types';
import Contract from '../lib/contract'
import { getDeviceInformation, DeviceInfo } from "../lib/devices"
import { getDepositDevice } from "../lib/deployment"

const DeviceView = (props) => {
    return (<DeviceComponent {...props} />)
}

type Props = {
    provider: object,
    networkName: string,
    deviceAddress: string
}

type State = {
    contract: Contract
    properties: DeviceInfo
}

class DeviceComponent extends Component<Props, State> {

    state: State = {
        contract: null,
        properties: {} as DeviceInfo
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        if (this.props && this.props.deviceAddress) {
            console.log("In device");

            let contractInstance = await getDepositDevice(this.props.provider, this.props.networkName, this.props.deviceAddress)
            let contract: Contract = new Contract('DepositDevice', this.props.deviceAddress, contractInstance)
            const properties = await getDeviceInformation(contractInstance)
            this.setState({
                contract,
                properties
            })
        }
    }

    renderObjectProperties() {
        let properties = this.state.properties
        return Object.keys(properties).map(key => {
            return <li>{key + ": " + properties[key]}</li>
        })
    }

    render() {
        let contractRender = []
        contractRender.push(<p></p>)
        const contract = this.state.contract
        if (contract && this.state.properties) {
            contractRender.push(<p>{contract.address}</p>)
            contractRender.push(<ul>{this.renderObjectProperties()}</ul>)

        }
        return (
            <div className="contractMain">
                {contractRender}
            </div>
        );
    }
}

export default DeviceView