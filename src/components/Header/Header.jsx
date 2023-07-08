import { Avatar, Badge, Button, Col, Form, Row, notification } from 'antd'
import { CloseCircleOutlined, UserOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
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
import CartPopover from './CartPopover'
import UserManagement from './UserManagement'
import { doResetCart } from '../../redux/cart/cartsSlice'

const Header = (props) => {
  const { searchBook, setSearchBook } = props
  const { user, isAuthenticated } = useSelector((state) => state.account)
  const { products } = useSelector((state) => state.carts)
  const [totalOrders, setTotalOrders] = useState(0)
  const [isOpenUserManagement, setIsOpenUserManagement] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const countTotalOrders = () => {
    let totalOrder = 0

    if (products.length > 0) {
      products.map((product) => {
        totalOrder += product.quantity
      })
    }

    setTotalOrders(totalOrder)
  }

  useEffect(() => {
    countTotalOrders()
  }, [products])

  const logout = async () => {
    if (window.confirm('Are you sure to logout? ')) {
      let response = await handleLogout()
      if (response?.data) {
        dispatch(doLogoutAction())

        //reset cart
        dispatch(doResetCart())
        notification.success({
          message: 'Logout sucessfully!',
          duration: 2,
        })
        navigate('/')
      }
    }
  }

  const openModalUserManagement = () => {
    setIsOpenUserManagement(!isOpenUserManagement)
  }

  let items = [
    {
      label: (
        <Link
          to="#"
          style={{ color: 'rgb(128, 128, 137)' }}
          onClick={openModalUserManagement}
        >
          User Management
        </Link>
      ),
      key: 'user',
    },
    {
      label: (
        <Link to="/history" style={{ color: 'rgb(128, 128, 137)' }}>
          Order history
        </Link>
      ),
      key: 'orderHistory',
    },
    {
      label: (
        <div style={{ color: 'rgb(128, 128, 137)' }} onClick={logout}>
          Log out
        </div>
      ),
      key: 'logout',
    },
  ]

  // check if user is ADMIN, add submenu Admin management to items
  if (user?.role === 'ADMIN') {
    items.unshift({
      label: (
        <Link to="/admin" style={{ color: 'rgb(128, 128, 137)' }}>
          Admin Management
        </Link>
      ),
      key: 'admin',
    })
  }

  const handleSearch = (event) => {
    setSearchBook(event.target.value)
  }

  return (
    <Row className="home-header">
      <Col
        className="home-header-container"
        xxl={12}
        xl={15}
        lg={18}
        md={22}
        sm={22}
        xs={23}
      >
        <Col
          className="book-store-logo"
          onClick={() => {
            navigate('/')
          }}
        >
          <img src={Logo} alt="" width={75} height={70} />
        </Col>
        <Col
          className="search-bar"
          xxl={12}
          xl={11}
          lg={8}
          md={8}
          sm={10}
          xs={10}
        >
          <Input.Search
            placeholder="input search text"
            enterButton
            size="medium"
            value={searchBook}
            onChange={handleSearch}
            suffix={
              <CloseCircleOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => setSearchBook('')}
              />
            }
          />
        </Col>

        <CartPopover>
          <Badge
            count={totalOrders}
            overflowCount={99}
            size="large"
            offset={[-5, 5]}
          >
            <AiOutlineShoppingCart className="cart-icon" />
          </Badge>
        </CartPopover>

        {isAuthenticated === true ? (
          <Dropdown menu={{ items }} trigger={['click']} className="account">
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
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        ) : (
          <Col className="account-login">
            <Link to="/login">
              <CiFaceSmile className="face-icon" />
              <p>Account</p>
            </Link>
          </Col>
        )}

        {/* <Button>Login account</Button> */}
        <Col className="support" xxl={3} xl={3} lg={3} md={3} sm={0} xs={0}>
          <div className="support-wrap">
            <BiSupport className="support-icon" />
            <p>Support</p>
          </div>
        </Col>
      </Col>

      <UserManagement
        isOpenUserManagement={isOpenUserManagement}
        openModalUserManagement={openModalUserManagement}
      />
    </Row>
  )
}

export default Header
