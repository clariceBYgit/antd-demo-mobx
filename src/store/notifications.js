import { makeObservable, action, observable} from 'mobx'
import { getNotifications } from '../requests'
class Notifications {
    constructor(){
        makeObservable(this)
    }

    @observable isLoading = false
    @observable list = []

    @action startMarkAsRead = () => { //开始标记已读
        this.isLoading = true
    }

    @action finishMarkAsRead = () => {//结束标记已读
        this.isLoading = false
    }
    @action markNotificationAsReadById = (id) =>{ //根据id标记已读
        this.startMarkAsRead()
        setTimeout(() => {
            const newList = this.list.map( item => {
                if( item.id === id){
                    item.hasRead = true
                }
                return item
            })
            this.list = newList
            this.finishMarkAsRead()
        }, 2000);
    }
    @action marAllNotificationsAsRead = () => { //标记所有的未读信息为已读
        this.startMarkAsRead()
        setTimeout(() => {
            this.list.map(item => {
                item.hasRead = true
                return item
            })
        }, 2000);
        this.finishMarkAsRead()

    }

    @action getNotificationsList = () => { //获取通知列表
        this.startMarkAsRead()
        getNotifications().then(
            res => {
                this.list = res.list
            }
        )
        this.finishMarkAsRead()

    }
}

export default new Notifications()