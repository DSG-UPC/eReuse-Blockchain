import { Component } from 'react'
import {withRouter} from 'next/router';
import Contract from '../../lib/contract'
import { getDeviceInformation, DeviceInfo } from '../../lib/devices'
import { getDepositDevice } from '../../lib/deployment'

const DeviceView = (props) => {
    return (<DeviceComponent {...props} />)
}

type Props = {
    provider: Object,
    networkName: string,
    router: Object
}

type State = {
    contract: Contract
    properties: DeviceInfo
    deviceAddress: string
}

class DeviceComponent extends Component<Props, State> {

    state: State = {
        contract: null,
        properties: {} as DeviceInfo,
        deviceAddress: null
    }

    constructor(props) {
        super(props);
    }

    static getInitialProps({ query }) {
        return { query }
    }

    async componentDidMount() {
        const deviceAddress = this.props.router.query.deviceAddress;
        if (this.props && deviceAddress) {
            let contractInstance = await getDepositDevice(this.props.provider, this.props.networkName, deviceAddress)
            let contract = new Contract('DepositDevice', deviceAddress, contractInstance)
            const properties = await getDeviceInformation(contractInstance)
            this.setState({
                contract,
                properties,
                deviceAddress
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
                {/* {contractRender} */}
            </div>
        );
    }
}

export default withRouter(DeviceView)