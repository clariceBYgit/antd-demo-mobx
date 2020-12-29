import React, { Component } from 'react'


import{
    Form,
    Input,
    Button,
    Checkbox,
    Card,
    Spin
} from 'antd'

import { UserOutlined, LockOutlined} from '@ant-design/icons'


import './login.less'

import { Redirect } from 'react-router-dom'
import { observer,inject } from 'mobx-react'
import { toJS } from 'mobx'


@Form.create()

@inject('userStore')
@observer
class Login extends Component {
  constructor(){
      super()
      this.state = {
        userInfoState : null
      }
      
  }
    handleSubmit = (e) => {
        const { userStore } = this.props
        e.preventDefault();
        this.props.form.validateFields( (err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                this.props.userStore.login(values)
                    .then(res => {
                        this.state({
                            userInfoState: userStore.userInfo
                        })
                        console.log(this.userInfoState)
                    })
            }
        })
    }   
    render() {
       
       const { getFieldDecorator } = this.props.form
        let { userStore:{userInfo, isLogin}} = this.props
        return (
            isLogin 
            
            ?

            <Redirect userInfoState= {this.state.userInfoState} to='/admin' />
            :
            <Card title='QX ADMIN登录'
                className="qx-login-wrapper"
            >
            <Spin spinning={userInfo.isLoading} size="large">
                <Form
                    className="login-form"
                    onSubmit={this.handleSubmit}
                    >
                    <Form.Item>
                        {
                            getFieldDecorator('username', {
                                rules: [{ 
                                    required: true,
                                    message: '用户名必须' }]
                            })(

                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('password', {
                                rules: [{ 
                                    required: true,
                                    message: '密码必须' }]
                            })(
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="用户密码"
                                    />
                            )
                        }
                    
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(<Checkbox>记住我</Checkbox>)
                        }
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                        
                    </Form.Item>

                </Form>
            </Spin>
            </Card>
            
        )
    }
}


export default  Login