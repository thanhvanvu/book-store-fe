import React, { useState } from 'react'

import { Button, Divider, Modal, Space, Table, Tag } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

import { message, Upload } from 'antd'

const { Dragger } = Upload

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

const ModalCreateBulkUser = (props) => {
  let isOpenImportModal = props.isOpenImportModal

  // https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      // must set onSuccess = OK
      // code will run to status === 'done' block
      onSuccess('ok')
    }, 1000)
  }

  // for upload component
  const propsUpload = {
    name: 'file',
    multiple: false,
    maxCount: 1, // limit upload 1 file only
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    accept: ' .csv, .xls, .xlsx',

    // use customRequest to get file only, not uploading
    customRequest: dummyRequest,

    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  return (
    <Modal
      title="Import data user"
      open={isOpenImportModal}
      onCancel={() => {
        props.handleModalImport()
      }}
      okText="Import data"
      width={'70vw'}
    >
      <Divider></Divider>

      <Dragger {...propsUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single. Only accept .csv, .xls, .xlsx
        </p>
      </Dragger>

      <Divider></Divider>
      <Table
        columns={columns}
        dataSource={data}
        title={() => {
          return <span>File information: </span>
        }}
      />
    </Modal>
  )
}

export default ModalCreateBulkUser
