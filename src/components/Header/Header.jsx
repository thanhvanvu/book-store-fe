import { Avatar, Badge, Button, Col, Row } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import React from 'react'

import './Header.scss'
import Logo from '../../assets/logo/logo-book-store.png'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { CiFaceSmile } from 'react-icons/ci'
import { BiSupport } from 'react-icons/bi'
import { Input, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const { Search } = Input

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
      <a href="https://www.aliyun.com" style={{ color: 'rgb(128, 128, 137)' }}>
        Log out
      </a>
    ),
    key: '1',
  },
]

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.account)
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
