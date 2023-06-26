import React, { useEffect, useState } from 'react'
import './UpdateUser.scss'
import { Avatar, Button, Col, Form, Input, Row, Upload, message } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'
import {
  handleFetchAccount,
  handleRefreshToken,
  handleUpdateUser,
  handleUploadAvatar,
} from '../../services/userService'
import { useDispatch, useSelector } from 'react-redux'
import {
  doFetchAccount,
  doUpdateAccount,
} from '../../redux/account/accountSlice'

const prefixSelector = (
  <Form.Item noStyle>
    <div>+1</div>
  </Form.Item>
)

const UpdateUser = () => {
  const [avatar, setAvatar] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.account.user)

  useEffect(() => {
    setAvatar(user.avatar)
  }, [user])

  // upload file avatar to server
  const uploadAvatar = async ({ file, onSuccess, onError }) => {
    const response = await handleUploadAvatar(file)

    if (response?.data) {
      const avatarName = response.data.fileUploaded
      const avatarUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/images/avatar/${avatarName}`

      setAvatar(avatarName)
      setAvatarUrl(avatarUrl)
      onSuccess('ok')
    } else {
      onError('Fail to upload')
    }
  }

  const updateUserApi = async (value) => {
    setIsLoading(true)

    if (value) {
      value.avatar = avatar
    }
    console.log(value)

    const response = await handleUpdateUser(value)
    if (response?.data) {
      // force app to refresh token
      const resToken = await handleRefreshToken()
      if (resToken?.data?.access_token) {
        const token = resToken.data.access_token
        localStorage.setItem('access_token', token)
      }

      // call fetch account and update redux state
      const resAccount = await handleFetchAccount()

      if (resAccount?.data?.user) {
        const userData = resAccount.data.user
        dispatch(doUpdateAccount(userData))
      }
    }
  }

  return (
    <Row className="update-user-wrapper">
      <Col span={10} className="avatar-container">
        <div className="avatar">
          <Avatar
            size={120}
            icon={<UserOutlined />}
            src={
              avatarUrl
                ? avatarUrl
                : `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                    user.avatar
                  }`
            }
          />
        </div>

        <div className="upload">
          <Upload
            multiple={false}
            maxCount={1}
            name="avatar"
            customRequest={uploadAvatar}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </div>
      </Col>
      <Col className="information">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={updateUserApi}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            hidden
            labelCol={{ span: 24 }}
            label="Id"
            name="_id"
            initialValue={user ? user.id : ''}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
            initialValue={user ? user.email : ''}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Full name"
            name="fullName"
            initialValue={user ? user.fullName : ''}
            rules={[
              { required: true, message: 'Please input your full name!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Phone number"
            name="phone"
            initialValue={user ? user.phone : ''}
            rules={[
              { required: true, message: 'Please input your phone number!' },
            ]}
          >
            <Input addonBefore={prefixSelector} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default UpdateUser
