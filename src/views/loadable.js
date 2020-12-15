// 此文件用于解释react-loadable的原理

import React, { Component } from 'react'

const Loadable = ({
    loader,
    loading: Loading
})=> {
    return class LoadableComponent extends Component {
        state = {
            LoadedComponent: null
        }

        componentDidMount() {
            // loader()  实际上执行这句话  import('./Dashboard'),
            loader()
                .then(res => {
                    this.setState({
                        LoadedComponent: res.default
                    })
                })
        }

        render() {
            const {
                LoadedComponent
            } = this.state
            return (
                LoadedComponent
                ?
                <LoadedComponent />
                :
                <Loading />
                
            )
        }
    }
}


export default Loadable