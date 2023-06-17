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
  message,
} from 'antd'

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import {
  handleCreateNewProduct,
  handleFetchCategory,
  handleUploadImage,
} from '../../../services/productService'

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

const ModalAddNewProduct = (props) => {
  let isOpenModal = props.isOpenModal
  const [form] = Form.useForm()
  const [isSubmit, setIsSubmit] = useState(false)

  const [imgProductUploaded, setImgProductUploaded] = useState([])
  const [imgThumbnailUploaded, setImgThumbnailUploaded] = useState('')

  const [loading, setLoading] = useState(false)
  const [loadingSlider, setLoadingSlider] = useState(false)
  const [categorySelect, setCategorySelect] = useState()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState()

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

  const handleChangeThumbnail = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
    }
  }

  const handleChangeProductImage = (info) => {
    if (info.file.status === 'uploading') {
      setLoadingSlider(true)
      return
    }
    if (info.file.status === 'done') {
      setLoadingSlider(false)
    }
  }

  const handleUploadThumbnail = async ({ file, onSuccess, onError }) => {
    const response = await handleUploadImage(file)
    if (response?.data) {
      setImgThumbnailUploaded(response.data.fileUploaded)
      onSuccess('ok')
    } else {
      onError('Fail to upload')
    }
  }

  const handleUploadProductImage = async ({ file, onSuccess, onError }) => {
    const response = await handleUploadImage(file)

    //https://stackoverflow.com/questions/55823296/reactjs-prevstate-in-the-new-usestate-react-hook
    if (response?.data) {
      setImgProductUploaded((prevState) => [
        ...prevState,
        response.data.fileUploaded,
      ])
      onSuccess('ok')
    } else {
      onError('Fail to upload')
    }
  }

  const handlePreviewImage = (file) => {
    setPreviewOpen(true)

    // convert image to base 64
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url)
    })
  }

  // create a new product
  const createNewProduct = async (productValue) => {
    setIsSubmit(true)
    if (productValue) {
      productValue.slider = imgProductUploaded
      productValue.thumbnail = imgThumbnailUploaded
    }

    const response = await handleCreateNewProduct(productValue)
    if (response?.data) {
      message.success('Create a new product successfully!')
      setIsSubmit(false)

      // close modal
      form.resetFields()
      props.handleOpenCloseModal()
      setImgProductUploaded([])
      setImgThumbnailUploaded([])
      props.getSortedProductWithPaginate()
    }
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
        okText="Create product"
        onCancel={() => {
          form.resetFields()
          setImgProductUploaded([])
          setImgThumbnailUploaded([])
          props.handleOpenCloseModal()
        }}
        confirmLoading={isSubmit}
      >
        <Divider></Divider>

        <Form
          form={form}
          name="basic"
          style={{ maxWidth: '100%' }}
          onFinish={createNewProduct}
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
                    message: 'Please input your sold number!',
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
              >
                <Upload
                  onPreview={handlePreviewImage}
                  multiple={false}
                  maxCount={1}
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadThumbnail}
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
              >
                <Upload
                  onPreview={handlePreviewImage}
                  multiple={true}
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadProductImage}
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

      <Modal
        open={previewOpen}
        // title={previewTitle}
        footer={null}
        onCancel={() => {
          setPreviewOpen(false)
        }}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default ModalAddNewProduct
