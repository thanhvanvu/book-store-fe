import { useEffect, useState } from 'react'
import { Popconfirm, Spin, Table, message } from 'antd'
import { Button, Form, Input, Space } from 'antd'
import moment from 'moment'
import './ProductTable.scss'
import UserViewDetail from './ProductViewDetail'
import {
  ReloadOutlined,
  ExportOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { utils, writeFileXLSX } from 'xlsx'

import ModalAddNewProduct from './ModalAddNewProduct'
import {
  handleDeleteProduct,
  handleSearchProductWithPaginate,
  handleSortProductWithPaginate,
} from '../../../services/productService'
import ProductViewDetail from './ProductViewDetail'
import ModalUpdateProduct from './ModalUpdateProduct'

const ProductTable = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  })
  const [sortField, setSortField] = useState('-createdAt')
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const [data, setData] = useState([])
  const [form] = Form.useForm()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [viewDetailProduct, setViewDetailProduct] = useState({})
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [dataProductUpdate, setDataProductUpdate] = useState({})

  const columns = [
    {
      title: 'Id',
      dataIndex: '_id',
      align: 'center',
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setOpenDrawer(true), setViewDetailProduct(record)
            }}
          >
            {record._id}
          </a>
        )
      },
    },
    {
      title: 'Product Name',
      dataIndex: 'mainText',
      align: 'center',
      sorter: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      align: 'center',
      sorter: true,
    },
    {
      title: 'Author / Seller',
      dataIndex: 'author',
      align: 'center',
      sorter: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'center',
      sorter: true,
    },

    {
      title: 'Created At',
      dataIndex: 'createdAt',
      align: 'center',
      sorter: true,
    },

    {
      title: 'Action',

      render: (productData) => {
        return (
          <>
            <Space
              wrap
              className="search-clear-button"
              style={{ display: 'flex', justifyContent: 'space-around' }}
            >
              <EditOutlined
                style={{ color: '#FFCD01', cursor: 'pointer' }}
                onClick={() => handleOpenEditModal(productData)}
              />
              <Popconfirm
                placement="left"
                title="Delete product"
                description="Are you sure to delete this product ?"
                onConfirm={() => deleteProduct(productData)}
                okText="Delete"
                cancelText="Cancel"
              >
                <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
              </Popconfirm>
            </Space>
          </>
        )
      },
      align: 'center',
    },
  ]

  const getSortedProductWithPaginate = async () => {
    setIsLoadingTable(true)
    const response = await handleSortProductWithPaginate(pagination, sortField)

    if (response?.data?.result) {
      let userData = response.data.result
      let meta = response.data.meta
      setPagination({
        ...pagination,
        total: meta.total,
      })

      userData.map((user) => {
        user.createdAt = moment(user.createdAt).format('MM-DD-YYYY')
      })

      setData(userData)
      setIsLoadingTable(false)
    }
  }

  useEffect(() => {
    getSortedProductWithPaginate()
  }, [pagination.current, pagination.pageSize, sortField])

  const onChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })

    //set query to the react state
    let query
    if (sorter?.field) {
      if (sorter.order === 'ascend') {
        query = `${sorter.field}`
        setSortField(query)
      } else if (sorter.order === 'descend') {
        query = `-${sorter.field}`
        setSortField(query)
      } else {
        query = ''
        setSortField(query)
      }
    }
  }

  // search
  const searchFilter = async (values) => {
    // if all fiels are undefined, do nothing
    if (!values.mainText && !values.author && !values.category) {
      return
    }

    // if input = undefined, set value = ''
    Object.keys(values).map((key) => {
      if (!values[key]) {
        values[key] = ''
      }
    })

    const response = await handleSearchProductWithPaginate(pagination, values)
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

  // set drawer is false
  const handleOnClose = () => {
    setOpenDrawer(false)
  }

  // handle on click to open modal add new user
  const handleOpenCloseModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  // https://docs.sheetjs.com/docs/demos/frontend/react/
  const handleExport = () => {
    if (data.length > 0) {
      const workSheet = utils.json_to_sheet(data)
      const workBook = utils.book_new()
      utils.book_append_sheet(workBook, workSheet, 'Data')
      writeFileXLSX(workBook, 'ProductList.xlsx')
    }
  }

  const handleOpenEditModal = (productData) => {
    setDataProductUpdate(productData)
    setIsOpenEditModal(!isOpenEditModal)
  }

  // handle delete user
  const deleteProduct = async (productData) => {
    const userId = productData._id
    const response = await handleDeleteProduct(userId)
    if (response?.data) {
      message.success('Delete product successfully!')
      await getSortedProductWithPaginate()
    } else {
      message.error('You can not delete this product!')
    }
  }

  const RenderTitle = () => {
    return (
      <div className="user-title-header">
        <span className="title-name">Table List Users</span>
        <div className="right-content">
          <Button type="primary" onClick={handleExport}>
            <ExportOutlined />
            Export
          </Button>

          <Button type="primary" onClick={handleOpenCloseModal}>
            <PlusOutlined />
            Add new product
          </Button>

          <ReloadOutlined
            className="icon-refresh"
            style={{ cursor: 'pointer' }}
            onClick={() => getSortedProductWithPaginate()}
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
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: '100%', marginBottom: 20 }}
        onFinish={searchFilter}
        autoComplete="off"
        layout="inline"
      >
        <Form.Item labelCol={{ span: 24 }} label="Product name" name="mainText">
          <Input
            placeholder="input product name"
            onPressEnter={() => form.submit()}
          />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Author / Seller"
          name="author"
        >
          <Input
            placeholder="input author / seller"
            onPressEnter={() => form.submit()}
          />
        </Form.Item>

        <Form.Item labelCol={{ span: 24 }} label="Category" name="category">
          <Input
            placeholder="input phone number"
            onPressEnter={() => form.submit()}
          />
        </Form.Item>
      </Form>

      <div style={{ marginBottom: 20, display: 'flex', gap: 20 }}>
        <Button type="primary" htmlType="submit" onClick={() => form.submit()}>
          Search
        </Button>
        <Button htmlType="submit" onClick={() => form.resetFields()}>
          Clear
        </Button>
      </div>

      <Spin tip="Loading..." spinning={isLoadingTable}>
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
      </Spin>

      <ProductViewDetail
        openDrawer={openDrawer}
        onClose={handleOnClose}
        viewDetailProduct={viewDetailProduct}
      />

      <ModalAddNewProduct
        isOpenModal={isOpenModal}
        handleOpenCloseModal={handleOpenCloseModal}
        getSortedProductWithPaginate={getSortedProductWithPaginate}
      />

      <ModalUpdateProduct
        handleOpenEditModal={handleOpenEditModal}
        isOpenEditModal={isOpenEditModal}
        dataProductUpdate={dataProductUpdate}
        getSortedProductWithPaginate={getSortedProductWithPaginate}
      />
    </>
  )
}

export default ProductTable
