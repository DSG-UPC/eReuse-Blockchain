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

    parseParams(query: string): object {
        const params = query.split('&');
        let result = {}
        params.map((i: string) => {
            let entry = i.split('=')
            result[entry[0]] = entry[1]
        })
        return result
    }

    cleanProperties(properties: object): object {
        const numElements =Object.keys(properties).length;
        for (let i = 0; i < numElements; i++) {
            delete properties[i];
        }
        return properties
    }

    static async getInitialProps(query) {
        return { query };
    }

    async componentDidMount() {
        console.log(location)
        let params = this.parseParams(location.search.substr(1));
        console.log(params)
        if (params['type'] && params['proof']) {
            let contractInstance = await getProofsHandler(this.props.provider, this.props.networkName);
            let proof: IProof = {
                proofHash: params['proof'],
                proofType: params['type']
            };
            let properties = await getProofInformation(contractInstance, params['proof'], params['type']);
            properties = this.cleanProperties(properties);
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
