import { Avatar, Badge, Button, Col, Row, notification } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import React from 'react'

import './Header.scss'
import Logo from '../../assets/logo/logo-book-store.png'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { CiFaceSmile } from 'react-icons/ci'
import { BiSupport } from 'react-icons/bi'
import { Input, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { handleLogout } from '../../services/userService'
import { doLogoutAction } from '../../redux/account/accountSlice'

const { Search } = Input

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.account)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
        <a
          href="https://www.antgroup.com"
          style={{ color: 'rgb(128, 128, 137)' }}
        >
          Account management
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <div style={{ color: 'rgb(128, 128, 137)' }} onClick={logout}>
          Log out
        </div>
      ),
      key: '1',
    },
  ]

  return (
    <Row className="home-header">
      <Col className="home-header-container" span={20}>
        <Col span={2} className="book-store-logo">
          <img src={Logo} alt="" width={75} height={70} />
        </Col>
        <Col className="search-bar" span={14}>
          <Search placeholder="input search text" enterButton size="medium" />
        </Col>
        <Badge count={11} overflowCount={10}>
          <AiOutlineShoppingCart className="cart-icon" />
        </Badge>

        {isAuthenticated === true ? (
          <Dropdown menu={{ items }} trigger={['click']} className="account">
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar size="medium" icon={<UserOutlined />} /> {user.fullName}
                <DownOutlined />
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

        {/* <Button>Login account</Button> */}
        <div className="support">
          <BiSupport className="support-icon" />
          <p>Support</p>
        </div>
      </Col>
    </Row>
  )
}

export default Header
