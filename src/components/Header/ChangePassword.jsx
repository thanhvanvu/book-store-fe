import { Button, Col, Form, Input, Row, message } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { handleChangePassword } from '../../services/userService'

const ChangePassword = (props) => {
  const user = useSelector((state) => state.account.user)
  const openModalUserManagement = props.openModalUserManagement
  const [form] = Form.useForm()
  const [isLoading, setIsloading] = useState(false)

  const changePassword = async (value) => {
    setIsloading(true)
    if (value) {
      const response = await handleChangePassword(value)
      if (response?.data) {
        message.success('Change password successfully!')
        setIsloading(false)
        openModalUserManagement()

        // Reset form
        form.resetFields()
      } else {
        message.error('Error while trying to change password!')
      }
    }
  }
  return (
    <div className="change-password-wrapper">
      <Col>
        <Form
          form={form}
          onFinish={changePassword}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            initialValue={user.email}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Old password"
            name="oldpass"
            rules={[
              { required: true, message: 'Please input your old password!' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            name="newPassword"
            label="New password"
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
            name="newpass"
            labelCol={{ span: 24 }}
            label="Confirm new password"
            dependencies={['newPassword']} // Update the dependencies prop value
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error(
                      'The new password that you entered does not match!'
                    )
                  )
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 18 }}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </div>
  )
}

export default ChangePassword
