import { Component } from 'react'
import { getProofsHandler } from "../../lib/deployment"
import AppContext, { IAppContext } from '../../components/app-context';
import { getProofInformation, getProofKeys } from '../../lib/proofs'
import { IProof } from '../../lib/types'
import { List } from 'antd';

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

    formatProperties(properties: Array<object>, proofType: string): object {
        let proofKeys = getProofKeys(proofType);
        let result = {}
        for (let k in proofKeys) {
            result[proofKeys[k]] = properties[k].toString();
        }
        return result
    }

    static async getInitialProps(query) {
        return { query };
    }

    async componentDidMount() {
        let params = this.parseParams(location.search.substr(1));
        if (params['type'] && params['proof']) {
            let contractInstance = await getProofsHandler(this.props.provider, this.props.networkName);
            let proof: IProof = {
                proofHash: params['proof'],
                proofType: params['type']
            };
            let properties = await getProofInformation(contractInstance, params['proof'], params['type']);
            properties = this.formatProperties(properties, proof.proofType);
            // console.log(`After cleaning: ${properties}`)
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
        const properties = this.state.properties
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
        );
        //     <div className="contractMain">
        //         {contractRender}
        //     </div>
        // );
    }
}
