// react中的获取dom  createRef

import React, { Component, createRef } from 'react'

import {
    Card,
    Button,
    Form, 
    Input,
    DatePicker,
    Spin,
    message
} from 'antd'

// wangeditor编辑器
import E from 'wangeditor'
// console.log(E)

// 引入less文件
import './editor.less'

import { 
  getArticleById,
  saveArticle

 } from '../../requests'

import moment from 'moment'

const formItemLayout= {
  labelCol: {
    span:4
  },
  wrapperCol:{
    span:20
  }
}

// 从v4开始  form表单的不再用Form.create()来创建  而是由 Form.useForm()来代替
@Form.create()
class Edit extends Component {
  constructor () {
    super()
    this.editorRef = createRef()
    this.state = {
      isSaving:false
    }
   

  }
  // 提交信息
  handleSubmit = (e) => {
    // 阻止默认行为
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // value.createAt.valueOf() 将moment时间戳转换为时间
        // console.log(value.createAt.valueOf())
        const data = Object.assign(
          {}, 
          values,
          {createAt: values.createAt.valueOf()}
         
        )
        // console.log(data)
        this.setState({
          isSaving: true
        })

        saveArticle(this.props.match.params.id, data)
          .then(res => {
            message.success(res.msg)
            // console.log(res)
            // 根据需求是否跳转
            this.props.history.push('/admin/article')
          })
          // 在一个组件销毁后不可再次设置state  （防止内存泄漏处理）
          // .finally(() => {
          //   this.setState({
          //     isSaving: false
          //   })
          // })
      }
    })

  }

  initEditor = () => {
    this.editor = new E(this.editorRef.current)
    // onchange 设置内容
    this.editor.customConfig.onchange =  (html) => {
      // html 即变化之后的内容
      // console.log(html)
      // setFieldsValue  修改控件的值
      this.props.form.setFieldsValue({
        content: html
      })
  }
    this.editor.create()
  }
  

  componentDidMount() {
     this.initEditor()

     this.setState({
       isSaving: true
     })

     getArticleById(this.props.match.params.id)
      .then(res => {
        //  console.log(res)
        const { id, ...data } = res
        data.createAt = moment(data.createAt)
        this.props.form.setFieldsValue(data)
        // 设置内容
        this.editor.txt.html(data.content)
      })

      .finally(() => {
        this.setState({
          isSaving:false
        })
      })
  }


    render() {
      const { 
        getFieldDecorator
       } = this.props.form
// console.log(this.props.form)
    return (
          <Card title='编辑文章'
            extra={<Button onClick={this.props.history.goBack}>取消</Button>}
           >
            <Spin spinning={this.state.isSaving}>
              <Form
            {...formItemLayout}
              onSubmit={this.handleSubmit}
              className="login-form"
            >
              <Form.Item
                label="标题"
              >
              {
                getFieldDecorator('title', {
                  rules: [{
                    required: true, 
                    message: '标题是必填的'}]
                })(
                  <Input placeholder="标题" />
                )
              }
              </Form.Item>
            
               <Form.Item
                label="作者"
              >
              {
                getFieldDecorator('author', {
                  rules: [{
                    required: true, 
                    message: '作者是必填的'}]
                })(
                  <Input placeholder="admin" />
                )
              }
              </Form.Item>
               <Form.Item
                label="阅读量"
              >
              {
                getFieldDecorator('amount', {
                  rules: [{
                    required: true, 
                    message: '阅读量是必填的'}]
                })(
                  <Input placeholder="0" />
                )
              }
              </Form.Item>

               <Form.Item
                label="发布时间"
              >
              {
                getFieldDecorator('createAt', {
                  rules: [{
                    required: true, 
                    message: '时间是必填的'}]
                })(
                  <DatePicker showTime  placeholder="选择时间"/>
                )
              }
              </Form.Item>

               <Form.Item
                label="内容"
              >
              {
                getFieldDecorator('content', {
                  rules: [{
                    required: true, 
                    message: '内容是必填的'}]
                })(
                  // 富文本编辑器  获取dom元素   
                  // react中获取dom元素使用createRef
                  <div className="qx-editor" ref={this.editorRef} />
                )
              }
              </Form.Item>

              <Form.Item wrapperCol={{offset: 4}}>
                <Button type="primary" htmlType="submit"    className="login-form-button">
                  保存修改
                </Button>
              </Form.Item>
           
            </Form>
          </Spin>
        </Card>
        )
    }
}

export default  Edit


