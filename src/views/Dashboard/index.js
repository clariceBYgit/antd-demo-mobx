import React, { Component, createRef } from 'react'


import {
    Card,
    Row,
    Col

} from 'antd'

import './dashboard.less'

import { getArticleAmount } from '../../requests'
// echarts依旧要结合dom操作  因此 需要引入 createRef
// import echarts from 'echarts'
// console.log(eacherts)
export default class Dashboard extends Component {
    constructor () {
        super()
        this.articleAmount = createRef()
    }
    // echarts的使用
    initArticleEchart = () => {
        // this.articleEchart = echarts.init(this.articleAmount.current)

        getArticleAmount()
            .then(res => {
                  // 指定图表的配置项和数据
                //   console.log(res)
                const option = {
                
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: res.amount.map(item => item.month)
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: Object.values(res.amount),
                        type: 'line',
                        areaStyle: {}
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                // this.articleEchart.setOption(option);
            })
      
    }
    componentDidMount () {
        this.initArticleEchart()
    }

    render() {
        return (
            <>
                <Card title='概览' bordered={false}>
                    <Row gutter={16}>
                        <Col className='gutter-row' span={6}>
                            <div className="qf-gutter-box" style={{backgroundColor:'#7E57C2'}} >col-6</div>
                        </Col>
                        <Col className='gutter-row' span={6}>
                            <div className="qf-gutter-box" style={{backgroundColor:'#388E3C'}} >col-6</div>
                        </Col>
                        <Col className='gutter-row'span={6}>
                            <div className="qf-gutter-box" style={{backgroundColor:'#F57F17'}}  >col-6</div>
                        </Col>
                        <Col className='gutter-row' span={6}>
                            <div className="qf-gutter-box" style={{backgroundColor:'#d50000'}} >col-6</div>
                        </Col>
                    </Row>
                </Card>
                <Card title="最近浏览量" bordered={false}>
                    <div ref={ this.articleAmount }  style={{ height:'400px' }} />
                </Card> 
            </>
        ) 
    }
}
