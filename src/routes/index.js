import {
    Dashboard,
    Login,
    NotFound,
    Settings,
    ArticleList,
    ArticleEdit,
    Notifications,
    NoAuth,
    Profile
} from '../views'


// 根据title不同显示不同的图标(遍历)，内设一个icon属性，对应的写具体icon组件
//在使用的文件中 先引入 Icon  通过component进行渲染出来  <Icon component={item.icon} />
import { 
    DashboardOutlined, 
    UnorderedListOutlined, 
    SettingOutlined 
} from '@ant-design/icons'


// 这些路由需要渲染到与App同级
export const mainRoutes = [{
    pathname: '/login',
    component: Login
},{
    pathname: '/404',
    component: NotFound  
}
]



export const adminRoutes = [{
    pathname: '/admin/dashboard',
    component: Dashboard,
    title: '仪表盘',
    icon:DashboardOutlined,
    isNav: true,
    // 角色权限 假定
    roles: ['001', '002', '003']
},{
    pathname: '/admin/article',
    component: ArticleList,
    title: '文章管理',
    icon:UnorderedListOutlined,
    exact:true, 
    isNav: true,
    roles: ['001', '002']
},{
    pathname: '/admin/article/edit/:id',
    component: ArticleEdit,
    roles: ['001','002']
    
},{
    pathname: '/admin/notifications',
    component: Notifications,
    roles: ['001', '002', '003']
    
},{
    pathname:'/admin/noauth',
    component: NoAuth,
    roles: ['001', '002', '003']
},{
    pathname:'/admin/profile',
    component: Profile,
    roles: ['001', '002', '003']
},
{
    pathname: '/admin/settings',
    component: Settings,
    title: '设置',
    icon:SettingOutlined,
    isNav: true,
    roles: ['001']
}
]