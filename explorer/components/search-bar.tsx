import { Component } from 'react'
import { proofTypes } from '../lib/proofs'
import AppContext, { IAppContext } from './app-context'
import Router from 'next/router'
import Link from 'next/link'

export default function SearchView(props) {
    return <AppContext.Consumer>
        {context => <SearchBar {...context} />}
    </AppContext.Consumer>
}

type State = {
    hash: string
    type: string
    hashLenght: number
}

class SearchBar extends Component<IAppContext, State> {

    state: State = {
        hash: '',
        type: proofTypes[0],
        hashLenght: 66
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.handleSelect = this.handleSelect.bind(this);
        this.handleWriting = this.handleWriting.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.renderUri = this.renderUri.bind(this);
    }

    handleWriting(e) {
        this.setState({ hash: e.target.value });
    }

    handleSelect(e) {
        this.setState({ type: e.target.value });
    }

    handleSearch(e) {
        console.log("Submitted")
        e.preventDefault();
        if (this.state.hash == '' || this.state.hash.length != this.state.hashLenght) {
            alert('You need to provide a valid address')
            // e.preventDefault();
        } else {
            console.log("Submitted: sending");
            Router.push({
                pathname: '/proofs/info',
                query: { hash: this.state.hash, type: this.state.type }
            })
        }
    }

    renderOptions() {
        return (
            <select id="proofTypes" onChange={this.handleSelect}>
                {Object.values(proofTypes).map((k, index) => {
                    return (
                        <option
                            key={k}
                            value={k}>
                            {k}
                        </option>)
                })}
            </select>)
    }

    renderUri() {
        Router.push({
            pathname: '/proofs/info',
            query: { hash: this.state.hash, type: this.state.type }
        })
    }

    render() {
        return (
            <div className="search-bar">
                <form
                    method="post"
                    // action={() => this.renderUri()}
                    onSubmit={e =>this.handleSearch(e)}>
                    <input
                        type="text"
                        placeholder="0x0"
                        onChange={this.handleWriting}>
                    </input>
                    {this.renderOptions()}
                    <input
                        type="submit"
                        value="Search!" />
                </form>
            </div>
        );
    }
}
