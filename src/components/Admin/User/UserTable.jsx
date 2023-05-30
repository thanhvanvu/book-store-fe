import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import { Button, Checkbox, Form, Input, Space, Pagination } from 'antd'

import './UserTable.scss'
import {
  handleGetAllUsers,
  handleGetUserWithPaginate,
} from '../../../services/userService'

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    sorter: true,
    align: 'center',
  },
  {
    title: 'Full Name',
    dataIndex: 'fullname',
    align: 'center',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    align: 'center',
  },
  {
    title: 'Phone number',
    dataIndex: 'phoneNumber',
    align: 'center',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    align: 'center',
  },

  {
    title: 'Action',

    render: (record) => {
      return (
        <>
          <Space
            wrap
            className="search-clear-button"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button type="primary" onClick={() => console.log(record)}>
              Update
            </Button>
            <Button type="primary" danger>
              Delete
            </Button>
          </Space>
        </>
      )
    },
    align: 'center',
  },
]

const UserTable = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  })
  const [data, setData] = useState([])

  const getUserWithPaginate = async () => {
    const response = await handleGetUserWithPaginate(pagination)

    let buildUserData = []
    if (response?.data?.result) {
      let userData = response.data.result
      let meta = response.data.meta
      setPagination({
        ...pagination,
        total: meta.total,
      })
      userData.map((user, index) => {
        let object = {}
        object.key = `${index}`
        object.id = user._id
        object.fullname = user.fullName
        object.email = user.email
        object.phoneNumber = user.phone
        object.role = user.role

        buildUserData.push(object)
      })
    }

    setData(buildUserData)
  }

  // useEffect(() => {
  //   getAllUser()
  // }, [])

  useEffect(() => {
    getUserWithPaginate()
  }, [pagination.current, pagination.pageSize])

  const onChange = (pagination, filters, sorter, extra) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
  }

  const onFinish = (values) => {
    console.log('Success:', values)
  }

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: '100%' }}
        onFinish={onFinish}
        autoComplete="off"
        layout="inline"
      >
        <Form.Item labelCol={{ span: 24 }} label="Name" name="name">
          <Input placeholder="input name" />
        </Form.Item>

        <Form.Item labelCol={{ span: 24 }} label="Email" name="email">
          <Input placeholder="input email" />
        </Form.Item>

        <Form.Item labelCol={{ span: 24 }} label="Phone number" name="number">
          <Input placeholder="input phone number" />
        </Form.Item>
      </Form>

      <Space wrap className="search-clear-button">
        <Button type="primary">Search</Button>
        <Button>Clear</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        pageSizeOptions={5}
      />
    </>
  )
}

export default UserTable
