import React from 'react'
import { Table } from 'antd'
import { Button, Checkbox, Form, Input, Space, Pagination } from 'antd'

import './UserTable.scss'

const UserTable = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Chinese Score',
      dataIndex: 'chinese',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: 'Math Score',
      dataIndex: 'math',
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: 'English Score',
      dataIndex: 'english',
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
  ]

  const data = [
    {
      key: '1',
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      key: '2',
      name: 'Jim Green',
      chinese: 98,
      math: 66,
      english: 89,
    },
    {
      key: '3',
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      key: '4',
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89,
    },
  ]
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', sorter)
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
        pagination={false}
      />
      <Pagination defaultCurrent={2} total={60} className="pagination" />
    </>
  )
}

export default UserTable
