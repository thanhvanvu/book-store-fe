import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  VideoCameraOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { UserOutlined } from '@ant-design/icons'

import { Layout, Menu, Button, theme, Dropdown, Space, Avatar } from 'antd'
import { RxDashboard } from 'react-icons/rx'
import AdminContent from './AdminContent'
import './AdminPage.scss'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { CiFaceSmile } from 'react-icons/ci'

const { Header, Sider, Content } = Layout

const items = [
  {
    label: (
      <a href="https://www.aliyun.com" style={{ color: 'rgb(128, 128, 137)' }}>
        Log out
      </a>
    ),
    key: '1',
  },
]

function AdminPage() {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const { user, isAuthenticated } = useSelector((state) => state.account)

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
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
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

          {isAuthenticated === true ? (
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              className="account"
              style={{ marginRight: '10px' }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size="medium" icon={<UserOutlined />} />{' '}
                  {user.fullName}
                </Space>
              </a>
            </Dropdown>
          ) : (
            <div className="account-login">
              <Link to="/login">
                <CiFaceSmile className="face-icon" />
                <p>Account</p>
              </Link>
            </div>
          )}
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
