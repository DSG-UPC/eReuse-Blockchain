import { Component } from 'react'
import { Button, Spin, Divider, Menu } from 'antd'
import Link from "next/link"


// MAIN COMPONENT
const IndexPage = (props) => {
  return <IndexView {...props} />
}


type State = {
  // connected?: boolean,
  address: string,
  num_tokens: number
};

// Stateful component
class IndexView extends Component<State> {
  state: State = {
    address: null,
    num_tokens: 0
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.setState({
      address: this.props.address,
      num_tokens: this.props.num_tokens
    })
  }

  renderSideMenu() {

    return <div id="page-menu">
      <Menu mode="inline" defaultSelectedKeys={['profile']} style={{ width: 200 }}>
      </Menu>
    </div>

  }

  renderUserInfo() {
    return <>
      <Divider />
      <h4>{"HEADER"}</h4>
    </>
  }

  renderGetStarted() {
    return <>
      <p>To login, install Metamask on your browser and try again.</p>
      <p><a href="https://metamask.io" target="_blank"><Button>Install Metamask</Button></a></p>
    </>
  }

  renderLoading() {
    return <div>Please, wait... <Spin size="small" /></div>
  }

  renderAccount() {
    return (<div className="section">
      <h2>Active Account</h2>
      <p>User ethereum address: {this.props.address}</p>
      <p>User tokens: {this.props.num_tokens}</p>
    </div>)
  }

  render() {
    return (
      <div id="index">
        <div className="card">
          <h3>Usody</h3>

          {this.renderAccount()}

          <div className="section">
            <Link href="/devices/">
              <a>Show devices</a>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
