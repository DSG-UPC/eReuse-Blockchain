import { Component } from 'react'
import { IContract } from '../../lib/types';
import Contract from '../../lib/contract'

const ContractView = (props) => {
    return (<ContractComponent {...props} />)
}

type State = {
    contract: Contract
}

class ContractComponent extends Component<Contract> {

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
        let contractRender = <p></p>
        if (this.state.contract) {
            contractRender = <p>{this.state.contract.address}</p>
        }
        return (
            <div className="contractMain">
                {contractRender}
            </div>
        );
    }
}

export default ContractView