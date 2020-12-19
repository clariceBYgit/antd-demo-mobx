import React, { Component } from 'react';
import { Route, Switch,Redirect } from 'react-router-dom' 

import { adminRoutes } from './routes'

import { Frame } from './components'
import { inject, observer } from 'mobx-react'

const menus = adminRoutes.filter(route => route.isNav === true)

// const mapState = state => ({
//   isLogin: state.user.isLogin,
//   role: state.user.role
// })
@inject('userStore')

@observer class App extends Component{
  render (){
    // console.log(this.props)
   
    return (
      
// 判断是否登录
    this.props.userStore.isLogin ? 
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
