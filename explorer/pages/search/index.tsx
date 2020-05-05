import { Component } from 'react'
import { proofTypes } from '../../lib/proofs'
import AppContext, { IAppContext } from '../../components/app-context'
import Router from 'next/router'
import { Input, Button, Form, Select, Divider } from 'antd'
const { Option } = Select


function SearchPage(props) {
    return <AppContext.Consumer>
        {context => <SearchView {...context} />}
    </AppContext.Consumer>
}

type State = {
    hash: string
    type: string
    recycleHash: string
    // recycleDevice: Address
    hashLenght: number
}

class SearchView extends Component<IAppContext, State> {

    state: State = {
        hash: '',
        type: proofTypes[0],
        hashLenght: 66,
        recycleHash: '',
        // recycleDevice: ''
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.handleTypeSelect = this.handleTypeSelect.bind(this);
        this.handleHashInput = this.handleHashInput.bind(this);
        this.handleProofSearch = this.handleProofSearch.bind(this);
    }

    handleHashInput(e) {
        this.setState({ hash: e.target.value });
    }

    
    handleTypeSelect(e) {
        this.setState({ type: e });
    }

    handleProofSearch(e) {
        console.log("Submitted")
        console.log(e)
        // e.preventDefault();
        if (e.hash == '' || e.hash.length != this.state.hashLenght) {
            alert('You need to provide a valid address')
            // e.preventDefault();
        } else {
            console.log("Submitted: sending");
            Router.push({
                pathname: '/proofs/info',
                query: { hash: e.hash, type: e.type }
            })
        }
    }

    handleRecycleHashInput(e) {
        this.setState({ recycleHash: e.target.value });
    }

    // handleRecycleDeviceInput(e) {
    //     this.setState({ recycleDevice: e.target.value });
    // }


    handleRecycledSearch(e) {
        console.log("Submitted")
        console.log(e)
        // e.preventDefault();
        if (e.recycleHash == '' || e.recycleHash.length != this.state.hashLenght) {
            alert('You need to provide a valid address')
            // e.preventDefault();
        } else {
            console.log("Submitted: sending");
            Router.push({
                pathname: '/proofs/info',
                query: { hash: e.recycleHash, type: 'ProofRecycling' }
            })
        }
    }

    renderProofsForm() {
        const hash = this.state.hash
        const type = this.state.type
        return (
            <div className="proofs-search">
                <Form
                    layout="inline"
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={e => this.handleProofSearch(e)}
                >
                    <Form.Item
                        label="Proof Hash"
                        name="hash"
                        rules={[{ required: true, message: 'Please input the proof hash!' }]}
                    >
                        <Input
                            value={hash}
                            type="text"
                            onChange={e => this.handleHashInput(e)}
                        // style={{ width: 100 }} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="Proof Type"
                        name="type"
                        rules={[{ required: true, message: 'Please select the proof Type!' }]}>
                        <Select
                            value={type}
                            style={{ width: 140, margin: '0 10px', border: 'black' }}
                            onChange={e => this.handleTypeSelect(e)}
                            bordered={true}
                        >
                            {Object.values(proofTypes).map((k, index) => {
                                return (
                                    <Option
                                        key={index}
                                        value={k}>
                                        {k}
                                    </Option>)
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    renderRecycledForm() {
        const recycleHash = this.state.recycleHash
        // const recycleDevice = this.state.recycleDevice
        return (
            <div className="recycled-search">
                <Form
                    layout="inline"
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={e => this.handleRecycledSearch(e)}>
                    <Form.Item
                        label="Recycle Hash"
                        name="recycleHash"
                        rules={[{ required: true, message: 'Please input the proof hash!' }]}>
                        <Input
                            value={recycleHash}
                            type="text"
                            onChange={e => this.handleRecycleHashInput(e)} />
                    </Form.Item>
                    {/* <Form.Item
                        label="Device Id"
                        name="id"
                        rules={[{ required: true, message: 'Please input the proof hash!' }]}>
                        <Input
                            value={recycleDevice}
                            type="text"
                            onChange={e => this.handleRecycleDeviceInput(e)} />
                    </Form.Item> */}
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    render() {
        return (
            <div id="page-body">
                {this.renderProofsForm()}
                <Divider/>
                {this.renderRecycledForm()}
            </div>
        )
    }
}


export default SearchPage