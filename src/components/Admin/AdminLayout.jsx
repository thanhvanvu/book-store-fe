import './AdminLayout.scss'
import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { UserOutlined } from '@ant-design/icons'
import {
  Layout,
  Menu,
  Button,
  theme,
  Dropdown,
  Space,
  Avatar,
  notification,
} from 'antd'
import { RxDashboard } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { CiFaceSmile } from 'react-icons/ci'
import { handleLogout } from '../../services/userService'
import { doLogoutAction } from '../../redux/account/accountSlice'
import Footer from '../Footer/Footer'
import { FiUsers } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const { Header, Sider, Content } = Layout

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.account)

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const logout = async () => {
    if (window.confirm('Are you sure to logout? ')) {
      let response = await handleLogout()
      if (response?.data) {
        dispatch(doLogoutAction())
        notification.success({
          message: 'Logout sucessfully!',
          duration: 2,
        })
        navigate('/')
      }
    }
  }

  const items = [
    {
      label: (
        <div style={{ color: 'rgb(128, 128, 137)' }} onClick={logout}>
          Log out
        </div>
      ),
      key: 'logout',
    },
  ]

  // Retrieve active menu item from local storage on component mount
  useEffect(() => {
    const storedActiveMenu = sessionStorage.getItem('activeMenu')
    if (storedActiveMenu) {
      setActiveMenu(storedActiveMenu)
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('activeMenu', activeMenu)
  }, [activeMenu])
  return (
    <>
      <Layout className="admin-page-layout">
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
          <div className="admin-title">Admin</div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={activeMenu}
            selectedKeys={activeMenu}
            onClick={(e) => setActiveMenu(e.key)}
            items={[
              {
                key: 'dashboard',
                icon: <RxDashboard />,
                label: <Link to="/admin">Dashboard</Link>,
              },
              {
                icon: <UserOutlined />,
                label: 'Manage Users',

                children: [
                  {
                    key: 'user',
                    icon: <FiUsers />,
                    label: <Link to="/admin/user">Users</Link>,
                  },
                ],
              },
              {
                key: 'book',
                icon: <BookOutlined />,
                label: <Link to="/admin/book">Manage Books</Link>,
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
                  <Space style={{ gap: 5 }}>
                    <Avatar
                      size="medium"
                      icon={<UserOutlined />}
                      src={
                        import.meta.env.VITE_BACKEND_URL +
                        `/images/avatar/${user.avatar}`
                      }
                    />
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
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <Footer />
    </>
  )
}

export default AdminLayout
