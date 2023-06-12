import { Button, Col, Rate, Row } from 'antd'
import React, { useRef, useState } from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/scss/image-gallery.scss'
import './ProductPage.scss'
import moment from 'moment'
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import ModalGallery from './ModalGallery'

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
]

const ProductPage = () => {
  const [isOpenGalleryModal, setIsOpenGalleryModal] = useState(false)
  const [currentImage, setCurrentImage] = useState()
  const [quantity, setQuantity] = useState(1)
  const refGallery = useRef()
  const onClickImage = () => {
    setIsOpenGalleryModal(!isOpenGalleryModal)
    setCurrentImage(refGallery.current.getCurrentIndex())
  }

  const date = moment(new Date()).format('MMMM DD')
  const dateDelivery = `${date} - ${new Date().getDate() + 10}`
  return (
    <>
      <div className="product-page-background">
        <Row gutter={[15, 15]}>
          <Col
            className="product-detail-wrapper"
            xxl={15}
            xl={15}
            lg={18}
            md={22}
            sm={22}
            xs={23}
          >
            <div className="product-image-gallery">
              <ImageGallery
                ref={refGallery}
                items={images}
                showNav={false}
                autoPlay={false}
                showPlayButton={false}
                slideOnThumbnailOver={true}
                onClick={onClickImage}
              />
            </div>
            <div className="product-detail-infomation">
              <Col className="product-seller">
                Seller: <span>dasdsa</span>
              </Col>
              <Col className="product-title">How Psychology</Col>
              <Col className="product-rating">
                <Rate disabled value={5} />
                <span>Sold: 123</span>
              </Col>
              <Col className="product-price">$192</Col>
              <Col className="product-delivery">
                <span style={{ marginRight: 20, color: 'rgb(128, 128, 137)' }}>
                  Delivery
                </span>
                FREE delivery{' '}
                <span style={{ fontWeight: 'bold' }}>{dateDelivery}</span>
              </Col>
              <Col className="product-quantity">
                <span style={{ marginRight: 20, color: 'rgb(128, 128, 137)' }}>
                  Quantity
                </span>
                <span className="quantity-right">
                  <button
                    onClick={() => {
                      if (quantity === 0) return
                      setQuantity(quantity - 1)
                    }}
                  >
                    <MinusOutlined />
                  </button>
                  <input value={quantity} disabled min={0} />
                  <button onClick={() => setQuantity(quantity + 1)}>
                    <PlusOutlined />
                  </button>
                </span>
              </Col>

              <Col className="product-button">
                <Button type="primary">Buy Now</Button>
                <Button type="primary">
                  <ShoppingCartOutlined />
                  Add to Cart
                </Button>
              </Col>
            </div>
          </Col>
        </Row>

        <ModalGallery
          isOpenGalleryModal={isOpenGalleryModal}
          images={images}
          closeModal={onClickImage}
          currentImage={currentImage}
        />
      </div>
    </>
  )
}

export default ProductPage
