import { Component } from 'react'
import { getProofsHandler } from "../../lib/deployment"
import AppContext, { IAppContext } from '../../components/app-context';
// import { getProofInformation, getProofKeys, proofTypeAttributes } from '../../lib/proofs'
import { getProofInformation, proofTypeAttributes, Proof, ProofType, proofTypes } from '../../lib/proofs'
// import { proofId } from '../../lib/types'
import { ProofID } from '../../lib/proofs'
import { List } from 'antd';
import { Instance } from '../../lib/types'
import Router, { withRouter } from 'next/router'

function DeviceView(props) {
    return <AppContext.Consumer>
        {context => <ProofComponent {...context} />}
    </AppContext.Consumer>
}

type State = {
    proofID: ProofID
    properties: Proof
}

class ProofComponent extends Component<IAppContext, State> {

    state: State = {
        proofID: null,
        properties: {} as Proof
    }

    constructor(props) {
        super(props);
    }

    formatProperties(properties: Proof, proofType: ProofType): Proof {
        let proofKeys = proofTypeAttributes[proofType];
        let result = {} as Proof;
        for (let k in proofKeys) {
            result[proofKeys[k]] = properties[k].toString();
        }
        return result;
    }

    static async getInitialProps(query) {
        return { query };
    }

    async componentDidMount() {
        console.log("Router" + Router.query)
        const type = Router.query.type
        const hash = Router.query.hash
        if (!type || !hash || Array.isArray(type) || Array.isArray(hash))
            throw new Error("Invalid arguments")
        if (!proofTypes.includes(type))
            throw new Error("Invalid proof type")
        let contractInstance: Instance = await getProofsHandler(this.props.provider, this.props.networkName);
        let proofID: ProofID = {
            hash: hash,
            type: type as ProofType
        };
        let properties = await getProofInformation(contractInstance, proofID);
        properties = this.formatProperties(properties, proofID.type);
        // console.log(`After cleaning: ${properties}`)
        this.setState({
            proofID,
            properties
        })
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

export default withRouter(DeviceView)