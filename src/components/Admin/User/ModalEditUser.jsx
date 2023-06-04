import { Divider, Modal, Button, Checkbox, Form, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { handleUpdateUser } from '../../../services/userService'

const ModalEditUser = (props) => {
  const isOpenEditModal = props.isOpenEditModal
  const dataUserEdit = props.dataUserEdit
  const [form] = Form.useForm()
  const [isSubmit, setIsSubmit] = useState(false)

  const updateUser = async (userInput) => {
    setIsSubmit(true)
    const response = await handleUpdateUser(userInput)
    if (response?.data) {
      message.success('Update user successfully!')
      await props.getUserWithPaginate()
      setIsSubmit(false)

      // close modal
      props.handleOpenEditModal()
    }
  }

  useEffect(() => {
    // set initial field for the form
    form.setFieldsValue(dataUserEdit)
  }, [dataUserEdit])

  return (
    <Modal
      title="Edit User"
      open={isOpenEditModal}
      onCancel={props.handleOpenEditModal}
      confirmLoading={isSubmit}
      okText="Update"
      onOk={() => {
        form.submit()
      }} // when click ok from modal, onFinish is trigger
    >
      <Divider></Divider>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={updateUser}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        fields={[
          {
            name: ['email'],
            value: dataUserEdit.email,
          },
        ]}
      >
        <Form.Item
          labelCol={{ span: 24 }}
          label="id"
          name="_id"
          rules={[{ required: true, message: 'Please input your full name!' }]}
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Full name"
          name="fullName"
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input disabled />
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
  )
}

export default ModalEditUser
