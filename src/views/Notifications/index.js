import React, { Component } from 'react'

import {
    Card,
    Button,
    List,
    Badge,
    Spin
} from 'antd'

import { connect } from 'react-redux'

import { markNotificationAsReadById, marAllNotificationsAsRead } from '../../actions/notifications'

const mapState = state => {
  const {
    list,
    isLoading
  } = state.notifications
  
  return {
    list,
    isLoading
    
  }
}


  @connect( 
    mapState, 
    { markNotificationAsReadById, marAllNotificationsAsRead }
    )


class Notifications extends Component {
    render() {
      // console.log(this.props.isLoading)
        return (
          <Spin spinning={this.props.isLoading}>
            <Card 
                bordered={false}
                title="通知中心"
                extra={
                <Button 
                  disabled={this.props.list.every( item => item.hasRead === true )} 
                  onClick={this.props.marAllNotificationsAsRead}
                  >全部标记为已读</Button>
              }
            >
                <List
                    itemLayout="horizontal"
                    dataSource={this.props.list}
                    renderItem={item => (
                    <List.Item  
                      extra={
                        item.hasRead 
                        ? 
                        null 
                        : <Button onClick={this.props.markNotificationAsReadById.bind(this, item.id)}>标记为已读</Button>}>
                        <List.Item.Meta
                            title={<Badge dot={!item.hasRead}>{item.title}</Badge>}
                            description={item.desc}
                        />
                    </List.Item>
                    )}
                />
            </Card>
          </Spin>
        )
    }
}

export default Notifications