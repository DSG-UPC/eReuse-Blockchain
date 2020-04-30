import { Component } from 'react'
import { proofTypes } from '../lib/proofs'
import AppContext, { IAppContext } from './app-context';

export default function SearchView(props) {
    return <AppContext.Consumer>
        {context => <SearchBar {...context} />}
    </AppContext.Consumer>
}

type State = {
    hash: string
    type: string
}

class SearchBar extends Component<IAppContext, State> {

    state: State = {
        hash: '',
        type: ''
    }

    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleWriting = this.handleWriting.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
    }

    async componentDidMount() {

    }

    handleWriting(e) {
        this.setState({ hash: e.target.value });
    }

    handleSelect(e) {
        this.setState({ type: e.target.value });
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

    render() {
        return (
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="0x0"
                    onChange={this.handleWriting}>
                </input>
                {this.renderOptions()}
            </div>
        );
    }
}
