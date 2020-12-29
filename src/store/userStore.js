import {  makeAutoObservable, action, observable, toJS, autorun, computed } from 'mobx'
import { loginRequest } from '../requests'
/*  新版的  mobx  不在需要手动@observable, @action, 直接使用  makeAutoObservable(this)
    还解决了 store中的数据变化 页面组件数据却不改变的问题
*/

class User {
    constructor(){
        makeAutoObservable(this)
    }   
        
        @observable name = 'User Info'
        @observable isLogin =  Boolean(window.localStorage.getItem('authToken')) || Boolean(window.sessionStorage.getItem('authToken'))
        @observable userInfo = {
                // id:'',
                // dispalyName: '',
                // avatar: '',
                isLoading: false,
                // role: ''
        }
        // @action getUserInfo=()=>{
        //     if(this.isLogin){
        //         const users = window.localStorage.getItem('userInfo') || window.sessionStorage.getItem('userInfo')
        //         console.log(users)
        //     }
        // }
        @action startLogin = () => { //开始登陆
                this.userInfo.isLoading = true;
                this.isLogin = false;

        }
        @action loginSuccess = (data) => { //登陆成功
            this.userInfo ={
                ...data,
                isLoading : false
            }
            this.isLogin = true
        }
        @action loginFailed = () => { //登陆失败
            window.localStorage.removeItem('authToken')
            window.sessionStorage.removeItem('authToken')
            window.localStorage.removeItem('userInfo')
            window.sessionStorage.removeItem('userInfo')
            this.isLogin = false
        }
        
        @action logout = () => { //退出登录
            this.loginFailed()
         

        }
        @action login = (userInfo) => { //登录
            this.startLogin()
            // console.log(userInfo.remember)
            loginRequest(userInfo).then( res => {
                if (res.data.code ===200) {
                    // 本地化存储
                    const {
                        authToken,
                        ...userInfo
                    } = res.data.data

                    if (userInfo.remember === true) {
                        window.localStorage.setItem('authToken', authToken)
                        window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
                    } else {
                        
                        window.sessionStorage.setItem('authToken',authToken)
                        window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))

                    }
                
                    this.loginSuccess(res.data.data)
                } else {
                    
                    this.loginFailed()
                }
            })
        }
        @action changeAvatar = (avatarUrl) =>{ //改变用户头像
            this.avatarUrl = avatarUrl

        }
}


export default new User()