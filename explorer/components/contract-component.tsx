import { Component } from 'react'
import { IContract } from '../lib/contract'

const ContractView = (props) => {
    return (<ContractComponent {...props} />)
}

type State = {
    contract: IContract
}

class ContractComponent extends Component<IContract> {

    state: State = {
        contract: null
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.setState({
            contract: this.props
        })
    }

    render() {
        if (this.state.contract) {
            return (<tr>
                <td className="centering">
                    {this.state.contract.contractName}
                </td>
                <td className="centering">
                    {this.state.contract.address}
                </td>
            </tr>);
        } else {
            return (<tr></tr>);
        }
    }
}

export default ContractView