import React, { useState } from 'react'
import { Button, Divider, Form, Input, Modal, notification } from 'antd'
import { handleCreateNewUser } from '../../../services/userService'

// const createNewUser = (values) => {
//   console.log('Success:', values)
// }

const ModalAddNewProduct = (props) => {
  let isOpenModal = props.isOpenModal
  const [form] = Form.useForm()
  const [isSubmit, setIsSubmit] = useState(false)

  const handleCancel = () => {
    form.resetFields()
    props.handleOpenCloseModal()
  }

  const createNewUser = async (values) => {
    setIsSubmit(true)
    const response = await handleCreateNewUser(values)
    if (response?.data) {
      notification.success({
        message: 'Success!',
        description: 'Create new user succesfully!',
      })
      setIsSubmit(false)

      // reset modal field
      form.resetFields()

      // reload the table list user
      props.getUserWithPaginate()

      // close the modal
      props.handleOpenCloseModal()
    } else {
      setIsSubmit(false)
      notification.error({
        message: 'Error!',
        description: 'Sorry, but there was an error during the login process!',
      })
    }
  }

  return (
    <>
      <Modal
        title="Create a new user"
        open={isOpenModal}
        onOk={() => {
          form.submit()
        }} // when click ok from modal, onFinish is trigger
        okText="Create user"
        onCancel={handleCancel}
        confirmLoading={isSubmit}
      >
        <Divider></Divider>

        <Form
          form={form}
          name="basic"
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          style={{ maxWidth: '100%' }}
          onFinish={createNewUser}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{ span: 24 }}
            label="Full name"
            name="fullName"
            rules={[
              { required: true, message: 'Please input your full name!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
                type: 'email',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }}
            label="Phone number"
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone number!' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ModalAddNewProduct
