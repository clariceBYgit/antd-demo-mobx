import actionTypes from './actionTypes'

import { getNotifications } from '../requests'

const startMarkAsRead = () => {
    return {
        type: actionTypes.START_NOTIFICATION_POST
    }
}


const finishMarkAsRead = () => {
    return {
        type: actionTypes.FINISH_NOTIFICATION_POST
    }
}

export const markNotificationAsReadById = (id) => {
    return dispatch => {
        dispatch(startMarkAsRead())
        // 模拟服务端请求
        
        setTimeout(() => {
            dispatch({
                type: actionTypes.MARK_NOTIFICATION_AS_READ_BY_ID,
                payload: {
                    id
                }
            })
            dispatch(finishMarkAsRead())
        },2000)

    }
}



export const marAllNotificationsAsRead = () => {
    return dispatch => {
        // console.log('1111')
        dispatch(startMarkAsRead())
        // 模拟服务端请求
        setTimeout(() => {
            dispatch({
                type: actionTypes.MARK_ALL_NOTIFICATIONS_AS_READ,
               
            })
            dispatch(finishMarkAsRead())
        },2000)
    }
}

export const getNotificationsList = () => {
    return dispatch => {
        // console.log('1111')
        dispatch(startMarkAsRead())
        // 模拟服务端请求
        getNotifications()
        .then(res => {
            dispatch({
                type: actionTypes.RECEIVED_NOTIFICATIONS,
                payload:{
                    list:res.list
                }
            })
            dispatch(finishMarkAsRead())
        })
    }
}