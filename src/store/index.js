import {  makeAutoObservable } from 'mobx'
import { loginRequest } from '../requests'
/*  新版的  mobx  不在需要手动@observable, @action, 直接使用  makeAutoObservable(this)
    还解决了 store中的数据变化 页面组件数据却不改变的问题
*/
class User {
    constructor(){
        makeAutoObservable(this)
    }
    name = 'User Info'
    isLoading = false
    isLogin = false
     startLogin = () => { //开始登陆
            this.isLoading = true;
            this.isLogin = false;
    }
     loginSuccess = () => { //登陆成功
        this.isLoading = false;
        this.isLogin = true;
        console.log(`登陆成功+${this.isLogin}`)

    }
     loginFailed = () => { //登陆失败
        window.localStorage.removeItem('authToken')
        window.sessionStorage.removeItem('authToken')
        window.localStorage.removeItem('userInfo')
        window.sessionStorage.removeItem('userInfo')
    }
         login = (userInfo) => {
        this.startLogin()
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
}

// class notifications {


// const startMarkAsRead = () => {
//     return {
//         type: actionTypes.START_NOTIFICATION_POST
//     }
// }


// const finishMarkAsRead = () => {
//     return {
//         type: actionTypes.FINISH_NOTIFICATION_POST
//     }
// }

// export const markNotificationAsReadById = (id) => {
//     return dispatch => {
//         dispatch(startMarkAsRead())
//         // 模拟服务端请求
        
//         setTimeout(() => {
//             dispatch({
//                 type: actionTypes.MARK_NOTIFICATION_AS_READ_BY_ID,
//                 payload: {
//                     id
//                 }
//             })
//             dispatch(finishMarkAsRead())
//         },2000)

//     }
// }



// export const marAllNotificationsAsRead = () => {
//     return dispatch => {
//         // console.log('1111')
//         dispatch(startMarkAsRead())
//         // 模拟服务端请求
//         setTimeout(() => {
//             dispatch({
//                 type: actionTypes.MARK_ALL_NOTIFICATIONS_AS_READ,
               
//             })
//             dispatch(finishMarkAsRead())
//         },2000)
//     }
// }

// export const getNotificationsList = () => {
//     return dispatch => {
//         // console.log('1111')
//         dispatch(startMarkAsRead())
//         // 模拟服务端请求
//         getNotifications()
//         .then(res => {
//             dispatch({
//                 type: actionTypes.RECEIVED_NOTIFICATIONS,
//                 payload:{
//                     list:res.list
//                 }
//             })
//             dispatch(finishMarkAsRead())
//         })
//     }
// }
// }

const userStore = new User()
export default userStore