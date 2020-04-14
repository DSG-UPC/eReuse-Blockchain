import { Component } from 'react'
import { Button, Spin, Divider, Menu } from 'antd'


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
        {/* <Menu.Item key="profile">
          <Link href={"/" + location.hash}>
            <a>Profile</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="proofs">
          <Link href={"/proofs/" + location.hash}>
            <a>Proofs</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="devices">
          <Link href={"/devices/" + location.hash}>
            <a>Devices</a>
          </Link>
        </Menu.Item> */}
      </Menu>
    </div>

  }

  renderUserInfo() {
    return <>
      <Divider />
      <h4>{"HEADER"}</h4>
      {/* <p>{this.context.account.address}</p> */}
      {/* <p><Link href={`/entities/edit/#/${this.state.entityId}`}><a><Button>Manage my entity</Button></a></Link></p> */}
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
    // { this.renderSideMenu() }
    return <div id="index">
      <div className="card">
        <h3>Usody</h3>
        {/* 
        {
          this.state.connected ? this.renderLoading() :
            (this.state.userAddress ? this.renderUserInfo() : this.renderGetStarted())
        } */}

        <div>
          <h1> Example</h1>
          <p>
            Examples of how to get started with Drizzle in various situations.
        </p>
        </div>

        {this.renderAccount()}

        <div className="section">
          <h2>DAO</h2>
          <p>
            This shows a simple ContractData component with no arguments, along
            with a form to set its value.
        </p>
          <p>
            <strong>Stored Value: </strong>
          </p>
        </div>


      </div>
    </div>
  }
}

// // Custom layout example
// IndexPage.Layout = props => <MainLayout>
//   {props.children}
// </MainLayout>

export default IndexPage
