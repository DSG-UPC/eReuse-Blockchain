import { Component } from 'react'
import { Button, Spin, Divider, Menu, Card, Avatar, List } from 'antd'
import SearchBar from '../components/search-bar'
import Link from "next/link"
import Icon, { UserOutlined } from '@ant-design/icons'
import { Address } from '../lib/types'


// MAIN COMPONENT
const IndexPage = (props) => {
  return <IndexView {...props} />
}


type State = {
  // connected?: boolean,
  address: Address,
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
    return (<div className="body-card">
      {/* <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }}/> */}
      {/* <SearchBar></SearchBar> */}
      <Card style={{ width: 300 }}
      // cover={}
      >
        <Card.Meta title="Active Account"  avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />}></Card.Meta>
        {/* <Card title="Active Account" extra={<a href="#">More</a>} style={{ width: 300 }}> */}
        <List
        >
          <List.Item >
            <List.Item.Meta title="Ethereum Address"/>
            {this.props.address}
          </List.Item>
          <List.Item >
            <List.Item.Meta title="# of Tokens"/>
            {this.props.num_tokens}
          </List.Item>
        </List>
      </Card>
    </div>)
  }

  render() {
    return (
      <div id="page-body">
        {/* <div className="body-card"> */}
        {this.renderAccount()}
        {/* </div> */}
      </div>
    )
  }
}

export default IndexPage
