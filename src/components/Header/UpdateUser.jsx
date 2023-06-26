import React, { useState } from 'react'
import './UpdateUser.scss'
import { Avatar, Button, Col, Form, Input, Row, Upload, message } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'
import { handleUploadAvatar } from '../../services/userService'
import { useSelector } from 'react-redux'

const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

const prefixSelector = (
  <Form.Item noStyle>
    <div>+1</div>
  </Form.Item>
)

const UpdateUser = () => {
  const [avatar, setAvatar] = useState('')
  const user = useSelector((state) => state.account.user)

  // upload file avatar to server
  const uploadAvatar = async ({ file, onSuccess, onError }) => {
    const response = await handleUploadAvatar(file)

    if (response?.data) {
      const avatarName = response.data.fileUploaded
      const avatarUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/images/avatar/${avatarName}`
      setAvatar(avatarUrl)
      onSuccess('ok')
    } else {
      onError('Fail to upload')
    }
  }

  const updateUserApi = (value) => {
    console.log(value)
  }

  return (
    <Row className="update-user-wrapper">
      <Col span={10} className="avatar-container">
        <div className="avatar">
          <Avatar size={120} icon={<UserOutlined />} src={avatar} />
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
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default UpdateUser
