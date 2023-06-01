import React, { useEffect, useState } from 'react'
import { read, utils, writeFileXLSX } from 'xlsx'

import { Button, Divider, Modal, Space, Table, Tag } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

import { message, Upload } from 'antd'
import { handleCreateBulkUser } from '../../../services/userService'
import template from './template.xlsx?url'

const { Dragger } = Upload

const columns = [
  {
    title: 'Full name',
    dataIndex: 'fullName',
    key: 'fullName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Phone number',
    dataIndex: 'phone',
    key: 'phone',
  },
]

const ModalCreateBulkUser = (props) => {
  let isOpenImportModal = props.isOpenImportModal
  const [dataFromSheet, setDataFromSheet] = useState([])
  const [fileList, setFileList] = useState([])
  const [isSubmitSheet, setIsSubmitSheet] = useState(false)

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

    async onChange(info) {
      const { status } = info.file

      // set file list before uploading
      setFileList(info.fileList)

      if (status !== 'uploading') {
        console.log(info.file, info.fileList)

        // reset data when dropping file
        setDataFromSheet([])
      }

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)

        // https://docs.sheetjs.com/docs/demos/frontend/react/
        if (info.fileList && info.fileList.length > 0) {
          const file = await info.fileList[0].originFileObj.arrayBuffer()
          const wb = read(file)
          const workSheet = wb.Sheets[wb.SheetNames[0]] // get the first worksheet
          const data = utils.sheet_to_json(workSheet, {
            header: ['fullName', 'email', 'phone'],
            range: 1,
          })

          if (data && data.length > 0) {
            data.map((data, index) => {
              data.password = '123456789'
            })
            setDataFromSheet(data)
          }
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  // handle submit sheet
  const hanleSubmitSheet = async () => {
    setIsSubmitSheet(true)
    const response = await handleCreateBulkUser(dataFromSheet)
    if (response?.data) {
      setIsSubmitSheet(false)

      if (response.data.countError === 0) {
        message.success(
          `Created Successfully: ${response.data.countSuccess} records`
        )

        // close the modal
        props.handleModalImport()

        // set fileList = []
        setFileList([])

        // reset dataFromSheet
        setDataFromSheet([])

        // refesh table
        props.getUserWithPaginate()
      } else {
        message.error(`Created Error: ${response.data.countError} records`)
      }
    }
  }

  return (
    <Modal
      title="Import data user"
      open={isOpenImportModal}
      onCancel={() => {
        props.handleModalImport()

        // set fileList = []
        setFileList([])

        // reset dataFromSheet
        setDataFromSheet([])
      }}
      onOk={hanleSubmitSheet}
      okText="Import data"
      width={'70vw'}
      okButtonProps={{ disabled: dataFromSheet.length > 0 ? false : true }}
      confirmLoading={isSubmitSheet}
    >
      <Divider></Divider>

      <Dragger {...propsUpload} fileList={fileList} onDownload={dataFromSheet}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single. Only accept .csv, .xls, .xlsx
        </p>
        <a
          href={template}
          download
          // stopPropagation to prevent double event
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          Download template sample
        </a>
      </Dragger>

      <Divider></Divider>
      <Table
        columns={columns}
        dataSource={dataFromSheet}
        title={() => {
          return <span>File information: </span>
        }}
        pagination={{
          pageSize: 5,
        }}
      />
    </Modal>
  )
}

export default ModalCreateBulkUser
