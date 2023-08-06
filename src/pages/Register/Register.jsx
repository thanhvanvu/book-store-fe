import React, { useState } from 'react'
import { Button, Col, Divider, Form, Input, Row, notification } from 'antd'
import './Register.scss'
import { handleRegister } from '../../services/userService'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [isSubmit, setIsSubmit] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setIsSubmit(true)

    let response = await handleRegister(values)
    setIsSubmit(false)
    if (response && response.data) {
      notification.success({
        message: 'Register sucessfully!',
        duration: 2,
      })
      navigate('/login')
    } else {
      notification.error({
        message: 'Error!',
        description: 'Email already exists, please use another email!',
        duration: 4,
      })
    }
  }

  return (
    <>
      <Row className="register-wrapper">
        <Col
          xxl={7}
          xl={10}
          lg={12}
          md={15}
          sm={18}
          xs={22}
          className="register-page"
        >
          <Form
            name="register"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 400 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <h3 className="register-title">Register</h3>
            <Divider></Divider>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: 'Please input your full name!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              name="email"
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

            <Form.Item
              labelCol={{ span: 24 }}
              name="confirm"
              label="Confirm Password:"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error(
                        'The two passwords that you entered do not match!'
                      )
                    )
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              labelCol={{ span: 24 }}
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please input your phone number!' },
              ]}
            >
              <Input style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 0 }}>
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Register
