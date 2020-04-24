import { Component } from 'react'
import { getProofsHandler } from "../../lib/deployment"
import AppContext, { IAppContext } from '../../components/app-context';
import { getProofInformation } from '../../lib/proofs'
import { IProof } from '../../lib/types'

export default function DeviceView(props) {
    return <AppContext.Consumer>
        {context => <ProofComponent {...context} />}
    </AppContext.Consumer>
}

type State = {
    proof: IProof
    properties: object
}

class ProofComponent extends Component<IAppContext, State> {

    state: State = {
        proof: null,
        properties: {}
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        console.log(location)
        console.log(location.pathname)
        const url = location.pathname.trim().split('/')
        const type = url[2]
        const hash = url[3]
        console.log(this.props)
        if (type && hash) {
            let contractInstance = await getProofsHandler(this.props.provider, this.props.networkName);
            let proof: IProof = {
                proofHash: hash,
                proofType: type
            };
            const properties = await getProofInformation(contractInstance, hash, type);
            this.setState({
                proof: proof,
                properties: properties
            })
        }
    }

    renderObjectProperties() {
        let properties = this.state.properties
        return Object.keys(properties).map((key, index) => {
            return <li key={key}>{key + ": " + properties[key]}</li>
        })
    }

    render() {
        let contractRender = []
        const proof = this.state.proof
        if (proof && this.state.properties) {
            contractRender.push(<h2 key={proof.proofType}>{proof.proofHash}</h2>)
            contractRender.push(<ul key={proof.proofHash}>{this.renderObjectProperties()}</ul>)
        }
        return (
            <div className="contractMain">
                {contractRender}
            </div>
        );
    }
}
