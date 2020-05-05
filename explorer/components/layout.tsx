import Link from "next/link"
// import logo from "../public/logo.png"
import Router from 'next/router'
import { Divider, Menu, Layout, List } from 'antd'
import { UploadOutlined, UserOutlined, VideoCameraOutlined, SearchOutlined } from '@ant-design/icons';
import AppContext from './app-context'
import { useContext } from "react"
const { Header, Content, Footer, Sider } = Layout;
type Props = {
  children: any,
  location: any,
  // title?: string
}


export default function ({ children, ...props }: Props) {
  // console.log(location)
  console.log(props)
  
  // let title = props && props.title
  // if (!title) {
  //     const context = useContext(AppContext)
  //     // if (context) title = context.title
  // }

  return <Layout style={{ minHeight: '100vh' }}>
    {/* <div id="layout" {...props}>
      <div className="top-bar">
            <Link href="/"><a><span className="title">{title || "Entities"}</span></a></Link>
        </div> */}
      <div className="logo">
       {/* <a href="http://www.usody.com"><img src="static/logo.png" /></a> */}
       <a href="http://www.usody.com">Usody</a>
      </div>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >


        {/* <div id="page-menu"> */}

        <Menu theme="dark" mode="inline" defaultSelectedKeys={props.location ? props.location.split('/')[1] : "profile"} >
          <Menu.Item key="profile">
            <UserOutlined />
            <Link href={"/"}>
              <a className="nav-text">Profile</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="devices">
            <Link href={"/devices"}>
              <a>Devices</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="proofs">
            <Link href={"/proofs"}>
              <a>Proofs</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="search">
            <SearchOutlined />
            <Link href={"/search"}>
              <a>Search</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>

      {/* </div> */}

      {/* <div className="content"> */}
      <Content  style={{ margin: '0 16px' }}>
        {children}
      </Content>
      {/* </div> */}
      <Footer style={{ textAlign: 'center' }}> Usody ©2020 </Footer>
    </Layout>
    {/* </div> */}
  </Layout>
}

// import Link from "next/link"
// import {Component, createElement} from 'react'
// import {Layout, Menu} from 'antd'
// import {
//   MenuUnfoldOutlined,
//   MenuFoldOutlined,
//   UserOutlined,
//   VideoCameraOutlined,
//   UploadOutlined,
// } from '@ant-design/icons'

// type Props = {
//     chilren: any
// }

// type State = {
//     collapsed: Boolean 
// }
// const { Header, Sider, Content, Footer } = Layout;


// class AppLayout extends Component<Props, State> {
//   state = {
//     collapsed: false,
//   };

//   toggle = () => {
//     this.setState({
//       collapsed: !this.state.collapsed,
//     });
//   };

//   render() {
//     return (
//       <Layout>
//         <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
//           <div className="logo" />
//           <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
//           <Menu.Item key="profile">
//                          <Link href={"/"}>
//                              <a>Profile</a>
//                          </Link>
//                      </Menu.Item>
//                      <Menu.Item key="devices">
//                          <Link href={"/devices/"}>
//                              <a>Devices</a>
//                          </Link>
//                      </Menu.Item>
//                      <Menu.Item key="proofs">
//                          <Link href={"/proofs/"}>
//                              <a>Proofs</a>
//                          </Link>
//                      </Menu.Item>
//           </Menu>
//         </Sider>
//         <Layout className="site-layout">
//           <Header className="site-layout-background" style={{ padding: 0 }}>
//             {createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
//               className: 'trigger',
//               onClick: this.toggle,
//             })}
//           </Header>
//           <Content
//             className="site-layout-background"
//             style={{
//               margin: '24px 16px',
//               padding: 24,
//               minHeight: 280,
//             }}
//           >
//             {this.props.children}
//           </Content>
//         </Layout>
//         <Footer>Footer</Footer>
//       </Layout>
//     );
//   }
// }

// export default AppLayout