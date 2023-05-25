import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme } from 'antd'
import { RxDashboard } from 'react-icons/rx'
import AdminContent from './AdminContent'
import './AdminPage.scss'

const { Header, Sider, Content } = Layout

function AdminPage() {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout className="admin-page-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="admin-title">Admin</div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              icon: <RxDashboard />,
              label: 'Dashboard',
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: 'Manage Users',
              children: [
                {
                  key: '2',
                  icon: <VideoCameraOutlined />,
                  label: 'nav 2',
                },
              ],
            },
            {
              key: '3',
              icon: <BookOutlined />,
              label: 'Manage Books',
            },
            {
              key: '4',
              icon: <DollarOutlined />,
              label: 'Manage Orders',
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: '100vh',
            background: colorBgContainer,
          }}
        >
          <AdminContent />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminPage
