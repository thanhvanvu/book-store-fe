import { useEffect, useState } from 'react'
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
} from 'antd'

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { handleFetchCategory } from '../../../services/productService'

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

const ModalAddNewProduct = (props) => {
  let isOpenModal = props.isOpenModal
  const [form] = Form.useForm()
  const [isSubmit, setIsSubmit] = useState(false)
  const [imageUrlThumbnail, setImageUrlThumbnail] = useState()
  const [imageUrlProduct, setImageUrlProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSlider, setLoadingSlider] = useState(false)
  const [categorySelect, setCategorySelect] = useState()

  const handleChangeThumbnail = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false)
        setImageUrlThumbnail(url)
      })
    }
  }

  const handleChangeProductImage = (info) => {
    if (info.file.status === 'uploading') {
      setLoadingSlider(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoadingSlider(false)

        setImageUrlProduct(url)
      })
    }
  }

  const handleCancel = () => {
    form.resetFields()
    props.handleOpenCloseModal()
  }

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await handleFetchCategory()
      if (response?.data) {
        let categories = response.data
        let catergorySelectList = []
        categories.map((category) => {
          let object = {}
          object.value = category
          object.label = category

          catergorySelectList.push(object)
        })

        setCategorySelect(catergorySelectList)
      }
    }

    fetchCategory()
  }, [])

  const handleChangeCategory = (value) => {
    console.log(value)
  }

  return (
    <>
      <Modal
        width={800}
        title="Create a new product"
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
          size=""
          style={{ maxWidth: '100%' }}
          // onFinish={createNewUser}
          autoComplete="off"
        >
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                label="Product name"
                name="mainText"
                rules={[
                  { required: true, message: 'Please input product name!' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                wrapperCol={{ span: 24 }}
                labelCol={{ span: 24 }}
                label="Author / Seller"
                name="author"
                rules={[
                  { required: true, message: 'Please input author/seller!' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Price"
                name="price"
                rules={[
                  { required: true, message: 'Please input the price !' },
                ]}
              >
                <InputNumber
                  addonAfter="USD"
                  min={1}
                  // formatter={(value) =>
                  //   ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  // }
                  // parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  onChange={handleChangeCategory}
                  options={categorySelect}
                  // options={[
                  //   { value: 'animal', label: 'animal' },
                  //   { value: 'plant', label: 'plant' },
                  //
                  // ]}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please input quantity!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Sold"
                name="sold"
                rules={[
                  {
                    required: true,
                    message: 'Please input your phone number!',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thumbnail image"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Upload
                  multiple={false}
                  maxCount={1}
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={({ onSuccess }) => {
                    setTimeout(() => {
                      onSuccess('ok')
                    }, 0)
                  }}
                  onChange={handleChangeThumbnail}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Product image"
                name="slider"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Upload
                  multiple={true}
                  maxCount={5}
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={({ onSuccess }) => {
                    setTimeout(() => {
                      onSuccess('ok')
                    }, 0)
                  }}
                  onChange={handleChangeProductImage}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default ModalAddNewProduct
