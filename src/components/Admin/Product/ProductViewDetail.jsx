import { Descriptions, Divider, Drawer, Modal, Upload } from 'antd'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { uid } from 'uid'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

const ProductViewDetail = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
  }

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  let openDrawer = props.openDrawer
  let viewDetailProduct = props.viewDetailProduct

  // build image list for image slider
  const buildImageList = (productDetail) => {
    let imageList = []
    // viewDetailProduct.

    if (productDetail?.thumbnail) {
      let object = {}
      object.uid = uid()
      object.name = productDetail.thumbnail
      object.url =
        import.meta.env.VITE_BACKEND_URL +
        `/images/book/${productDetail.thumbnail}`
      imageList.push(object)
    }

    if (productDetail && productDetail.slider) {
      let sliders = productDetail.slider
      sliders.map((slider) => {
        console.log(slider)
        let object = {}
        object.uid = uid()
        object.name = slider
        object.url = import.meta.env.VITE_BACKEND_URL + `/images/book/${slider}`
        imageList.push(object)
      })
    }

    setFileList(imageList)
  }

  useEffect(() => {
    buildImageList(viewDetailProduct)
  }, [viewDetailProduct])

  const handleOnClose = () => {
    props.onClose() // Call the onClose function from props
  }
  return (
    <Drawer
      title="View product detail information"
      placement="right"
      onClose={handleOnClose}
      open={openDrawer}
      width="60vw"
    >
      <Descriptions title="Product Infomation" bordered column={2}>
        <Descriptions.Item label="Id">
          {viewDetailProduct?._id ? viewDetailProduct._id : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Product name">
          {viewDetailProduct?.mainText ? viewDetailProduct.mainText : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Author/Seller">
          {viewDetailProduct?.author ? viewDetailProduct.author : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Price" span={2}>
          {viewDetailProduct?.price ? viewDetailProduct.price : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Category" span={3}>
          {viewDetailProduct?.category ? viewDetailProduct.category : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {viewDetailProduct?.createdAt
            ? moment(viewDetailProduct.createdAt).format('MM/DD/YYYY')
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {viewDetailProduct?.updatedAt
            ? moment(viewDetailProduct.updatedAt).format('MM/DD/YYYY')
            : ''}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" style={{ marginTop: 30 }}>
        Product Image
      </Divider>

      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        showUploadList={{ showRemoveIcon: false }}
      ></Upload>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Drawer>
  )
}

export default ProductViewDetail
