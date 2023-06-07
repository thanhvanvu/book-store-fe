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
  notification,
} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { uid } from 'uid'
import {
  handleFetchCategory,
  handleUpdateProduct,
  handleUploadImage,
} from '../../../services/productService'

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

const ModalUpdateProduct = (props) => {
  const isOpenEditModal = props.isOpenEditModal
  const dataProductUpdate = props.dataProductUpdate

  const [form] = Form.useForm()
  const [productImgList, setProductImgList] = useState([])
  const [thumbnail, setThumbnail] = useState([])
  const [isSubmit, setIsSubmit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingSlider, setLoadingSlider] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState()
  const [categorySelect, setCategorySelect] = useState()

  useEffect(() => {
    // set initial field for the form
    form.setFieldsValue(dataProductUpdate)

    buildImageList(dataProductUpdate)

    // clean up function => component will unmount
    return () => {
      form.resetFields()
    }
  }, [dataProductUpdate, form])

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

  // build image list for image slider
  const buildImageList = (productDetail) => {
    if (productDetail?._id) {
      let thumbnail = []
      let imageList = []
      // viewDetailProduct.

      if (productDetail?.thumbnail) {
        let object = {}
        object.uid = uid()
        object.name = productDetail.thumbnail
        object.url =
          import.meta.env.VITE_BACKEND_URL +
          `/images/book/${productDetail.thumbnail}`
        object.status = 'done'

        thumbnail.push(object)
        setThumbnail(thumbnail)
      }

      if (productDetail && productDetail.slider) {
        let sliders = productDetail.slider
        sliders.map((slider) => {
          let object = {}
          object.uid = uid()
          object.name = slider
          object.url =
            import.meta.env.VITE_BACKEND_URL + `/images/book/${slider}`
          object.status = 'done'
          imageList.push(object)
        })

        setProductImgList(imageList)
      }
    }
  }

  const handlePreviewImage = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }

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
    // setProductImgList(info.fileList)
    if (info.file.status === 'uploading') {
      setLoadingSlider(true)
      return
    }
    if (info.file.status === 'done') {
      setLoadingSlider(false)
    }
  }

  // remove file from the state list
  const removeFile = (file, type) => {
    if (type === 'slider') {
      const result = productImgList.filter((product) => {
        if (product.uid !== file.uid) {
          return product
        }
      })
      setProductImgList(result)
    } else if (type == 'thumbnail') {
      const result = thumbnail.filter((image) => {
        if (image.uid !== file.uid) {
          return image
        }
      })
      setThumbnail(result)
    }
  }

  const handleUploadProductImage = async ({ file, onSuccess, onError }) => {
    const response = await handleUploadImage(file)

    //https://stackoverflow.com/questions/55823296/reactjs-prevstate-in-the-new-usestate-react-hook
    if (response?.data) {
      let object = {}
      object.uid = uid()
      object.name = response.data.fileUploaded
      object.url =
        import.meta.env.VITE_BACKEND_URL +
        `/images/book/${response.data.fileUploaded}`
      object.status = 'done'

      setProductImgList((preState) => [...preState, object])
      onSuccess('ok')
    } else {
      onError('Fail to upload')
    }
  }

  const handleUploadThumbnail = async ({ file, onSuccess, onError }) => {
    const response = await handleUploadImage(file)
    //https://stackoverflow.com/questions/55823296/reactjs-prevstate-in-the-new-usestate-react-hook
    if (response?.data) {
      let object = {}
      object.uid = uid()
      object.name = response.data.fileUploaded
      object.url =
        import.meta.env.VITE_BACKEND_URL +
        `/images/book/${response.data.fileUploaded}`
      object.status = 'done'

      setThumbnail((preState) => [...preState, object])
      onSuccess('ok')
    } else {
      onError('Fail to upload')
    }
  }

  const updateProduct = async (productInfo) => {
    setIsSubmit(true)
    const productImgNameList = []
    let thumbnailName = ''
    if (productImgList && productImgList.length > 0) {
      productImgList.map((image) => {
        productImgNameList.push(image.name)
      })
    }

    if (thumbnail && thumbnail.length > 0) {
      thumbnail.map((image) => {
        thumbnailName = image.name
      })
    }

    // build data and send to backend
    productInfo.thumbnail = thumbnailName
    productInfo.slider = productImgNameList

    // validate for thumbnail and slider
    if (!productInfo.thumbnail || productInfo.slider.length === 0) {
      message.error('Missing Input!')
      return
    } else {
      // call api to update product
      const response = await handleUpdateProduct(productInfo)
      if (response?.data) {
        notification.success({
          message: `OK!`,
          description: `Update product successfully!`,
          duration: 1.5,
        })

        // close the form
        props.handleOpenEditModal()

        // refrest table
        props.getSortedProductWithPaginate()

        setIsSubmit(false)
      } else {
        notification.error({
          message: `Error!`,
          description: `Fail to update the product!`,
          duration: 1.5,
        })
      }
    }
  }

  return (
    <>
      <Modal
        width={800}
        title="Update a product"
        open={isOpenEditModal}
        onOk={() => {
          form.submit()
        }} // when click ok from modal, onFinish is trigger
        okText="Update product"
        onCancel={() => {
          form.resetFields()
          props.handleOpenEditModal()
          setThumbnail([])
          setProductImgList([])
        }}
        confirmLoading={isSubmit}
      >
        <Divider></Divider>

        <Form
          form={form}
          name="basic"
          style={{ maxWidth: '100%' }}
          onFinish={updateProduct}
          autoComplete="off"
        >
          <Form.Item
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            label="Id"
            name="_id"
            hidden
          >
            <Input />
          </Form.Item>
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
                <InputNumber style={{ width: '100%' }} min={0} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thumbnail image"
                name="thumbnail"
              >
                <Upload
                  onRemove={(file) => removeFile(file, 'thumbnail')}
                  defaultFileList={thumbnail}
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
                  onRemove={(file) => removeFile(file, 'slider')}
                  defaultFileList={productImgList}
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

export default ModalUpdateProduct
