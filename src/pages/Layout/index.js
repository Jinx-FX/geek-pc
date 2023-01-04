import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'

const { Header, Sider } = Layout

const GeekLayout = () => {
  // antd menu items
  const navigate = useNavigate()
  const homeMenu = { label: '数据概览', icon: <HomeOutlined />, key: '/' }
  const articleMenu = { label: '内容管理', icon: <DiffOutlined />, key: '/article' }
  const publishMenu = { label: '发布文章', icon: <EditOutlined />, key: '/publish' }
  const items = [homeMenu, articleMenu, publishMenu]
  const onClick = (e) => { navigate(e.key) }
  // 页面刷新的时候保持对应菜单高亮
  const location = useLocation()
  // 这里是当前浏览器上的路径地址
  const selectedKey = location.pathname
  // 获取用户数据
  const { userStore, loginStore } = useStore()
  useEffect(() => {
    userStore.getUserInfo()
  }, [userStore])
  // login out
  const onLogout = () => {
    loginStore.loginOut()
    navigate('/login')
  }
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={onLogout}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
            onClick={onClick}
          >
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* {二级路由出口} */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)