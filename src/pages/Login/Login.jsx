import React, { useState } from 'react'
import { Button, Col, Divider, Form, Input, Row, notification } from 'antd'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import './Login.scss'
import { handleLogin } from '../../services/userService'
import { useDispatch } from 'react-redux'
import { doLoginAction } from '../../redux/account/accountSlice'

import HashLoading from '../../components/Loading/HashLoading'

const Login = () => {
  const [isSubmit, setIsSubmit] = useState(false)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const onFinish = async (values) => {
    setIsSubmit(true)

    let response = await handleLogin(values)

    if (response?.data) {
      let accessToken = response.data.access_token
      // save access token in localstorage
      localStorage.setItem('access_token', accessToken)

      let user = response.data.user
      dispatch(doLoginAction(user))

      setIsSubmit(false)

      notification.success({
        message: 'Login sucessfully!',
        duration: 2,
      })
      navigate('/')
    } else {
      setIsSubmit(false)
      notification.error({
        message: 'Error!',
        description: 'Login information is incorrect!',
      })
    }
  }
  return (
    <>
      <Row className="login-wrapper">
        <Col
          xxl={7}
          xl={10}
          lg={12}
          md={15}
          sm={18}
          xs={22}
          className="login-page"
        >
          <Form
            name="login"
            labelCol={{ span: 20 }}
            wrapperCol={{ span: 0 }}
            style={{ maxWidth: 400 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <h3 className="login-title">Login</h3>
            <Divider></Divider>
            <Form.Item
              labelCol={{ span: 24 }}
              name="username"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 0 }}>
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Login
              </Button>
            </Form.Item>

            <Divider>Or</Divider>

            <div className="register-link">
              Do not have an account yet ?{' '}
              <Link to="/register">Register here</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Login
