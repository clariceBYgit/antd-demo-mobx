import React, { Component } from 'react'

import { 
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Typography,
  message,
  Tooltip
} from 'antd'


// 引入 xlsx 
import XLSX from 'xlsx'

import ButtonGroup from 'antd/lib/button/button-group'
import { getArticles, deleteArticleById } from '../../requests'
// 引入第三方时间日期格式化
import moment from 'moment'
  // 调试时
  // window.moment = moment
  
const titleDisplayMap = {
  id: 'id',
  title: '标题',
  author: '作者',
  createAt: '创建时间', 
  amount: '阅读量'
}

export default class ArticleList extends Component {
  // 定义数据
  constructor () { 
    super()
    this.state = {
      dataSource: [],
      columns : [],
      total: 0,
      isLoading: false,
      offset: 0,
      limited: 10,
      deleteArticleTitle: '',
      isShowArticleModal: false,
      deleteArticleConfirmLoading: false,
      deleteArticleID: null
    }
  }
// 创建table的中文columns的方法
  createColums = (columnKeys) => {
    const columns = columnKeys.map(item => {
      if( item === 'amount') {
        return {
          title: titleDisplayMap[item],
          key: item,
          render : (text, record) => {
            // 这里是根据数字的大小做一个条件渲染
              // 同理  可以根据职位不同显示不同的颜色
            const { amount } = record
          return (
            // Tooltip  文字提示
              <Tooltip title={ amount > 230 ? '超过230' : '没有超过230' }>

                <Tag color={ amount > 230 ? 'red' : 'green' }>{amount}</Tag>

              </Tooltip>
           ) 
          }
        }
       
    }
    if( item === 'createAt') {
      return {
        title: titleDisplayMap[item],
        key: item,
        render : (text, record) => {
          // 这里是根据数字的大小做一个条件渲染
            // 同理  可以根据职位不同显示不同的颜色
          const { createAt } = record
        return moment(createAt).format('YYYY年MM月DD日  HH:mm:ss')
        }
      }
     
  }
  /*
  
    antd中table columns的格式
    const columns = [{
                      title: '姓名',
                      dataIndex: 'name',
                      key: 'name',
                    }]

    antd中table dataSource的格式
    const dataSource = [{
                      key: '1',
                      name: '胡彦斌',
                    }]
  */
    return {
      title: titleDisplayMap[item],
      dataIndex: item,
      key: item
    }
  })
  columns.push(
    {
      title: '操作',
      key: 'actions',
      // record 就是当前的元素
      render: (text, record)=> {
        return (
          <ButtonGroup>
            <Button size='small' type='primary' onClick={this.toEdit.bind(this, record.id)}>编辑</Button>
            <Button size='small' type='danger' onClick={this.showDeleteArticle.bind(this, record)}>删除</Button>
          </ButtonGroup>
           
          )
      }
    }

  ) 
  return columns
}
  // 文章编辑
  toEdit = (id) => {
    // console.log(this.props)

    this.props.history.push({
      pathname: `/admin/article/edit/${id}`
      // // 路由隐式传参
      // state: {
      //   title: record.title
      // }

    })
  }

  showDeleteArticle = (record) => {
    // console.log(record)
    // Typography排版  文本的基本格式

    // 采用方法的形式调用modal  定制化不强

   /* Modal.confirm({
      title:'此操作不可逆，请谨慎！！' ,
      content:<Typography>确定要删除<span style={{color:'#f00'}}>{record.title}</span>吗?</Typography>,
      okText:'别墨迹，赶紧删除',
      cancelText:'亲，留下我！',
      onOk() {
        deleteArticle(record.id)
          .then(res => {
            console.log(res)
          })
      }
    })
  */ 
        
      this.setState({
        isShowArticleModal: true,
        deleteArticleTitle: record.title,
        deleteArticleID: record.id
      })

    } 
    
  // 删除数据
  deleteArticle = () => {
    // console.log(this.state.deleteArticleID)
    this.setState({
      deleteArticleConfirmLoading: true
    })
    deleteArticleById(this.state.deleteArticleID)
      .then(res => {
        message.success(res.msg)
        // 重新请求数据，沟通是否返回数据第一页或者当前页
        this.setState({
          offset: 0
        }, () => {
          // 回调中去发送请求
          this.getData()
        })
      })
      .finally( () => {
        this.setState({
          deleteArticleConfirmLoading: false,
          isShowArticleModal: false
        })
      })
  }


    // 点击取消，叉叉
    hideDeleteModal = () => {
      this.setState({
        isShowArticleModal:false,
        deleteArticleTitle: '',
        deleteArticleConfirmLoading:false
      })
    }
// 为防止因快速点击而导致数据未发送回来的切换报错    重写setState方法

  setData = (state) => {
    if (!this.updater.isMounted(this)) return
    this.setState(state)
  }

  // 发送ajax 请求数据
  getData = () => {
    this.setState({
      isLoading: true
    })
    getArticles(this.state.offset, this.state.limited)
      .then(resp => {
      // Object.keys 返回一个所有元素为字符串的数组，
      /*
        var arr = ['a', 'b', 'c'];
        console.log(Object.keys(arr)); // console: ['0', '1', '2']

        // array like object
          var obj = { 0: 'a', 1: 'b', 2: 'c' };
        console.log(Object.keys(obj)); // console: ['0', '1', '2']
      */
        const columnKeys = Object.keys(resp.list[0]) // ["id", "title", "author", "amount", "createAt"]
        const columns = this.createColums(columnKeys)
        // 若请求完成之后组件已经销毁，就不需要再设置setState
        // if (!this.updater.isMounted(this)) return

        this.setData({
          total:resp.total,
          dataSource: resp.list,
          columns
        })
      })
      .catch(err =>{
        // 处理错误 ，虽然有全局处理
      })
      .finally(() => {
        this.setData({
          isLoading:false
        })
    })
  }

  onPageChange = (page, pageSize)=> {
    // console.log(page,pageSize)
    this.setState({ 
      offset: pageSize*(page - 1),
      limited:pageSize
  },() => {
    this.getData()
  })
  }

  onShowSizeChange = (current, size) => {
    // 注意：当做此分页时 沟通好是跳转回第一页还是留在当前页
    // console.log(current, size)
    this.setState({ 
      offset: 0,
      limited: size
  },() => {
    this.getData()
  })
  }


  // 导出Excel表格
  // 前端导出Excel的局限
  // 由于是分页显示 因此  表格不完整只有当前页的（一般情况下导出Excel是由前端发送ajax请求，后端返回一个下载地址）
  toExcel = () => {
    // console.log('hhhh')
      /* convert state to workbook */
      // 组合数据
      const data = [Object.keys(this.state.dataSource[0])]  //[['id', 'title' ,'author','amount','createAt']]
      for (let i = 0 ; i < this.state.dataSource.length; i++){
        // 涉及到对象转数组
        // data.push(Object.values(this.state.dataSource[i]))   缺陷不易处理时间
        data.push([
          this.state.dataSource[i].id,
          this.state.dataSource[i].title,
          this.state.dataSource[i].author,
          this.state.dataSource[i].amount,
          moment(this.state.dataSource[i].createAt).format('YYYY年MM月DD日hh时mm分ss秒')
          
        ])


      }
      console.log(data)
      // 数据类型是[["a","b"],[1,2]]   二维数组
      const ws = XLSX.utils.aoa_to_sheet(data); 
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
      /* generate XLSX file and send to client */
      // 结合时间,页码修改文件名
      XLSX.writeFile(wb, `articles-第${this.state.offset / this.state.limited + 1}页-${moment().format('YYYY年MM月DD日hh时mm分ss秒')}.xlsx`)
  }
  componentDidMount () { 
    // console.log(this.updater.isMounted(this))
    this.getData()
  }

  // componentWillUnmount() {
  //   console.log(this.updater.isMounted(this))
  // }
    render() {
        return (
            <Card
             title="文章列表" 
             bordered={false}
             extra={<button onClick={this.toExcel} type="primary">导出Excel</button>}
             >
            <Table 
                loading={this.state.isLoading}
                rowKey={record => record.id}
                dataSource={this.state.dataSource}
                columns={this.state.columns}
                pagination={{
                  // 记录当前是第几页
                  current: this.state.offset / this.state.limited +1 ,
                  total:this.state.total,
                  // 只有一页时是否隐藏分页器
                  hideOnSinglePage: true,
                  // 是否可改变pageSize 
                  showSizeChanger:true,
                  // 是否可以快速跳转页
                  showQuickJumper:true,
                  onChange: this.onPageChange,
                  onShowSizeChange: this.onShowSizeChange,
                  pageSizeOptions:['10','15','20','25','30']
                }}
            />
            <Modal
              title='此操作不可逆，请谨慎！！'
              visible={this.state.isShowArticleModal}
              onCancel={this.hideDeleteModal}
              confirmLoading={this.state.deleteArticleConfirmLoading}
              // 点击蒙层是否关闭
              maskClosable={false}
              onOk={this.deleteArticle}
            >
              <Typography>
                确定要删除<span style={{color:'#f00'}}>{this.state.deleteArticleTitle}</span>吗?
                </Typography>
            </Modal>
          </Card>
        )
    }
}


