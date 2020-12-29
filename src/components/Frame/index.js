import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown, Avatar, Badge} from 'antd'
// 从4.0开始，antd不在内置icon组件，需要使用独立的包 @ant-design/icons
// 下载      npm i @ant-design/icons
// import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons'
import { DownOutlined } from '@ant-design/icons';



// 引入自定义的less
import './frame.less'
// 引入自己创的logo
import logo from './logo.png'

import { withRouter } from 'react-router-dom'

import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'

const { Header, Content, Sider } = Layout


// 装饰器模式
@inject('userStore','notifications')
@observer
@withRouter

class Frame extends Component {
  constructor( props ){
    super(props)
    this.state= {
      userState :null
    }

  }


  componentWilMount () {
   this.props.notifications.getNotificationsList()

  }

  saveState = () => {
    if( Boolean(window.localStorage.getItem('authToken')) || Boolean(window.sessionStorage.getItem('authToken'))){
      const users = window.localStorage.getItem('userInfo') || window.sessionStorage.getItem('userInfo')
      console.log(users)
      this.setState ({
        userState: users
      })
    }
  }
  onMenuClick = ({ key }) => {

      this.props.history.push(key)
  }
  onDropdownMenuClick = ({key}) => {
    if ( key ==='/logout') {
      this.props.userStore.logout()
    } else {

      this.props.history.push(key)
    }

    // console.log({key})
  }
  
  renderDropDown = () => (
      <Menu onClick={this.onDropdownMenuClick}>
        <Menu.Item key="/admin/notifications">
          <Badge dot={Boolean(this.props.notificationsCount)}>
              通知中心
          </Badge>
        </Menu.Item>
        <Menu.Item key="/admin/profile">
            个人设置
        </Menu.Item>
        <Menu.Item key="/logout">
           退出登录
        </Menu.Item>
      </Menu>
    )
  
    render() {
      const { notifications,userStore } = this.props
      const user = toJS(userStore.userInfo)
      console.log(user)
        // 菜单栏的高亮设置
        const selectedKeyArr = this.props.location.pathname.split('/')
        
        // console.log(selectedKeyArr)
        selectedKeyArr.length = 3

        // console.log(selectedKeyArr.join('/'))
        return (
        <Layout style={{minHeight: '100%'}}>
          {/*  当重写别人的样式时，不能对其原本的class  而是在其后面再加一个class进行重写*/}
          <Header className="header qx-header">
            <div className="qx-logo">
              <img src={logo} alt="qinaxi" />
            </div>
            <div style={{display:'flex',alignItems:"center"}}>
              <Dropdown overlay={this.renderDropDown()} trigger={['click']}>

                <div onClick={e => e.preventDefault()}>
                <Badge count={this.props.notificationsCount} offset={[-10,-5]}>
                  <Avatar src={user.avatar} />
                 <span> 欢迎您！{user.displayName}</span>
                </Badge>
                  <DownOutlined />
                </div>
              </Dropdown>
            </div>
          </Header>
          <Layout>
            <Sider width={200} className="site-layout-background">
              <Menu
                mode="inline"
                onClick={this.onMenuClick}
                selectedKeys={[selectedKeyArr.join('/')]}
                style={{ height: '100%', borderRight: 0 }}
              >
                  {
                      this.props.menus.map(item => {
                        return (
                          
                          <Menu.Item key={item.pathname}>
                            <Icon component={item.icon} />
                            {item.title}
                            </Menu.Item>
                          )
                      })
                  }
                
              
              </Menu>
            </Sider>
            <Layout style={{ padding: '16px' }}>
            
              <Content
                className="site-layout-background"
                style={{
                  margin: 0,
                  minHeight: 280,
                  backgroundColor: '#fff'
                }}
              >
                {this.props.children}
              </Content>
            </Layout>
          </Layout>
        </Layout>
        )
    }
} 


export default Frame