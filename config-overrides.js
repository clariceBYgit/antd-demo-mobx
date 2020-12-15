/*
   * @file  config-overrides.js
   * @author  clarice
   * 基于react-app-rewired和custmize的定制配置文件
*/


// 从customize-cra中引入相关方法
const { 
    override, 
    fixBabelImports, 
    addLessLoader,
    addDecoratorsLegacy 
} = require ('customize-cra')

// 从外面单独的文件中来设置主题颜色  theme
const theme = require('./theme')

module.exports = override(
    fixBabelImports('import',{
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),
    //    配置装饰器
    addDecoratorsLegacy(),
    // addLessLoader({
    //    javascriptEnabled: true,
    // //    配置主题颜色
    //     modifyVars: { 
    //         '@primary-color': '#f00' 
    //     },
    //  }),
    addLessLoader({
        javascriptEnabled: true,
     //    配置主题颜色
         modifyVars: theme
      }),

)