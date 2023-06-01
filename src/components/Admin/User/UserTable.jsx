import React, { useEffect, useState } from 'react'
import { Drawer, Table } from 'antd'
import { Button, Form, Input, Space } from 'antd'

import './UserTable.scss'
import {
  handleGetUserWithPaginate,
  handleSearchUserWithPaginate,
  handleSortUserWithPaginate,
} from '../../../services/userService'
import UserViewDetail from './UserViewDetail'
import {
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
} from '@ant-design/icons'

import ModalAddNewUser from './ModalAddNewUser'
import ModalCreateBulkUser from './ModalCreateBulkUser'

const UserTable = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  })
  const [data, setData] = useState([])
  const [searchInput, setSearchInput] = useState({})
  const [form] = Form.useForm()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [viewDetailUser, setViewDetailUser] = useState({})
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenImportModal, setIsOpenImportModal] = useState(false)

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      align: 'center',
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setOpenDrawer(true), setViewDetailUser(record)
            }}
          >
            {record._id}
          </a>
        )
      },
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      align: 'center',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      sorter: true,
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      align: 'center',
      sorter: true,
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

  const getUserWithPaginate = async () => {
    const response = await handleGetUserWithPaginate(pagination)
    if (response?.data?.result) {
      let userData = response.data.result
      let meta = response.data.meta
      setPagination({
        ...pagination,
        total: meta.total,
      })

      setData(userData)
    }
  }

  useEffect(() => {
    getUserWithPaginate()
  }, [pagination.current, pagination.pageSize])

  const onChange = async (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })

    // sort function here
    if (sorter?.field) {
      const query =
        sorter.order === 'ascend'
          ? `${sorter.field}`
          : sorter.order === 'descend'
          ? `-${sorter.field}`
          : ''

      const response = await handleSortUserWithPaginate(pagination, query)
      if (response?.data) {
        let meta = response.data.meta
        let userData = response.data.result
        setPagination({
          ...pagination,
          total: meta.total,
        })

        setData(userData)
      }
    }
  }

  // search
  const searchFilter = async (values) => {
    // if all fiels are undefined, do nothing
    if (!values.fullName && !values.email && !values.phone) {
      return
    }

    // if input = undefined, set value = ''
    Object.keys(values).map((key) => {
      if (!values[key]) {
        values[key] = ''
      }
    })

    setSearchInput(values)

    const response = await handleSearchUserWithPaginate(pagination, values)
    if (response?.data?.result) {
      let meta = response.data.meta
      let userData = response.data.result
      setPagination({
        ...pagination,
        total: meta.total,
      })
      setData(userData)
    }
  }

  // clear input form
  const clearForm = () => {
    form.resetFields()
  }

  // set drawer is false
  const handleOnClose = () => {
    setOpenDrawer(false)
  }

  // handle on click to open modal add new user
  const handleOpenCloseModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  // handle to open/close modal import user
  const handleModalImport = () => {
    setIsOpenImportModal(!isOpenImportModal)
  }

  const RenderTitle = () => {
    return (
      <div className="user-title-header">
        <span className="title-name">Table List Users</span>
        <div className="right-content">
          <Button type="primary">
            <ExportOutlined />
            Export
          </Button>

          <Button type="primary" onClick={handleModalImport}>
            <ImportOutlined />
            Import
          </Button>

          <Button type="primary" onClick={handleOpenCloseModal}>
            <PlusOutlined />
            Add new user
          </Button>

          <ReloadOutlined
            className="icon-refresh"
            style={{ cursor: 'pointer' }}
            onClick={() => getUserWithPaginate()}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: '100%', marginBottom: 30 }}
        onFinish={searchFilter}
        autoComplete="off"
        layout="inline"
      >
        <Form.Item labelCol={{ span: 24 }} label="Name" name="fullName">
          <Input placeholder="input name" />
        </Form.Item>

        <Form.Item labelCol={{ span: 24 }} label="Email" name="email">
          <Input placeholder="input email" />
        </Form.Item>

        <Form.Item labelCol={{ span: 24 }} label="Phone number" name="phone">
          <Input placeholder="input phone number" />
        </Form.Item>

        <Form.Item labelCol={{ span: 24 }} label="Action">
          <Space>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button htmlType="submit" onClick={clearForm}>
              Clear
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        title={RenderTitle}
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total, range) => {
            return <div>{range[0] + '-' + range[1] + ' out of ' + total}</div>
          },
        }}
        pageSizeOptions={5}
        loading={false}
      />

      <UserViewDetail
        openDrawer={openDrawer}
        onClose={handleOnClose}
        viewDetailUser={viewDetailUser}
      />

      <ModalAddNewUser
        isOpenModal={isOpenModal}
        handleOpenCloseModal={handleOpenCloseModal}
        getUserWithPaginate={getUserWithPaginate}
      />

      <ModalCreateBulkUser
        getUserWithPaginate={getUserWithPaginate}
        isOpenImportModal={isOpenImportModal}
        handleModalImport={handleModalImport}
      />
    </>
  )
}

export default UserTable
