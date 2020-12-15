import React, { Component } from 'react';
import { Route, Switch,Redirect } from 'react-router-dom' 

import { adminRoutes } from './routes'

import { Frame } from './components'
import { connect } from 'react-redux'


// import {
//     Button,
//     Spin,
//     Pagination,
//     Badge
// } from 'antd' 

const menus = adminRoutes.filter(route => route.isNav === true)

const mapState = state => ({
  isLogin: state.user.isLogin,
  role: state.user.role
})


@connect(mapState)

// // 配置装饰器  
// const testHOC = (WrappedComponent) => {
//   return class HOCComponent extends Component {
//     render() {
//       return (
//         <>
//           <WrappedComponent />
//           <div>这是高阶组件的内容</div>
//         </>
//       )
//     }
//   }
// }

// // 装饰器
// @testHOC

class App extends Component{
  render (){
   
    return (
      
// 判断是否登录
    this.props.isLogin ? 
    <Frame menus={menus}>
      <Switch>
        {
          adminRoutes.map(route => {
            return (
              <Route
                key={route.pathname}
                path={route.pathname}
                exact={route.exact}
                render={(routerProps) => {
                  const hasPermission = route.roles.includes(this.props.role)
                  return hasPermission ? 
                 <route.component {...routerProps} />
                 :
                 <Redirect to='/admin/noauth' />
                }}
              />
            )
          })
        }
        <Redirect to={adminRoutes[0].pathname} from='/admin' exact />
        <Redirect to='/404' />
      </Switch>
    </Frame>
    :
    <Redirect to='/login' />
    )
    
  }
}

export default App
