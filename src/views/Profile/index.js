import React, { Component } from 'react'
import { 
    Upload,
    Card,
    Spin

 } from'antd'


import axios from 'axios'

import { connect } from 'react-redux'


import { changeAvatar } from '../../actions/user'

const mapState = state => ({
    avatarUrl: state.user.avatar
})
 
@connect(mapState, { changeAvatar })

class Profile extends Component {

    state = {
        isUploading:false,
        avatarUrl:''
    }

     // customRequest通过覆盖默认的上传行为，可以自定义自己的上传实现
    handleUploadAvatar = ( { file } ) => {
        const data = new FormData()
        // 此处采用的是贴图库 www.tietuku.com
        data.append('Token','212273af5e26b6aa8522d5749ab99a489b9125d4:hezN0rf0RM_pD08RwVUa3HTSRfc=:eyJkZWFkbGluZSI6MTU4NzQ0Mzg4NCwiYWN0aW9uIjoiZ2V0IiwidWlkIjoiNzE2OTEyIiwiYWlkIjoiMTY4MjQ4MSIsImZyb20iOiJmaWxlIn0=')
        data.append('file', file)
        // 需要什么就用.get(键值名)  进行获取
        // console.log(data.get('Token'))  
        this.setState({
            isUploading:true
        })

        axios.post('http://up.imgapi.com/', data)
            .then(res => {
                if (res.status === 200) {
                    this.setState ({
                        isUploading: false
                    })
                    this.props.changeAvatar(res.data.linkurl)
                } else {
                    // 自行处理错误
                }
             })
            .catch(err => {

            })
    }

    render() {
        return (
           <Card 
            title='个人设置' 
            bordered={false}
           >
               <Upload
                    showUploadList={false}
                    // customRequest通过覆盖默认的上传行为，可以自定义自己的上传实现
                    customRequest={this.handleUploadAvatar}
               
               >

                   <div
                      style={{
                        width: 85,
                        height: 85,
                        border: '1px dashed #dedede',
                        textAlain: 'center',
                    }}   
                   >
                       <Spin spinning={this.state.isUploading}>
                        {
                            this.props.avatarUrl ? <img style={{width:80,height:80}} src={this.props.avatarUrl} alt='头像' /> : <span>点击上传</span>
                        }

                       </Spin>
                    
                   </div>
               </Upload>
           </Card>
        )
    }
}


export default Profile