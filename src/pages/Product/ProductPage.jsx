import { Button, Col, Input, Rate, Row, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
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
import { useNavigate, useSearchParams } from 'react-router-dom'
import { handleGetProductById } from '../../services/productService'
import ProductLoader from './ProductLoader'
import { useDispatch } from 'react-redux'
import { doAddToCart } from '../../redux/cart/cartsSlice'

const date = moment(new Date()).format('MMMM DD')
const dateDelivery = `${date} - ${new Date().getDate() + 10}`

const ProductPage = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [product, setProduct] = useState([])
  const [imagesGallery, setImagesGallery] = useState([])
  const [isOpenGalleryModal, setIsOpenGalleryModal] = useState(false)
  const [currentImage, setCurrentImage] = useState()
  const [quantity, setQuantity] = useState(1)
  const [isProductLoading, setIsProductLoading] = useState(false)
  const refGallery = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    getProductInformation()
  }, [window.location.href])

  const getProductInformation = async () => {
    setIsProductLoading(true)

    const productId = searchParams.get('id')

    const response = await handleGetProductById(productId)
    if (response?.data) {
      const product = response.data
      setProduct(product)

      let images = [
        {
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            product.thumbnail
          }`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            product.thumbnail
          }`,
        },
      ]

      const slider = product.slider

      if (slider && slider.length > 0) {
        slider.map((image) => {
          let object = {}
          object.original = `${
            import.meta.env.VITE_BACKEND_URL
          }/images/book/${image}`
          object.thumbnail = `${
            import.meta.env.VITE_BACKEND_URL
          }/images/book/${image}`

          images.push(object)
        })
      }

      setImagesGallery(images)
      setIsProductLoading(false)
    }
  }

  const onClickImage = () => {
    setIsOpenGalleryModal(!isOpenGalleryModal)
    setCurrentImage(refGallery.current.getCurrentIndex())
  }

  const handleQuantity = (e) => {
    if (e === 'plus') {
      const quantityAvailable = product.quantity - product.sold

      if (quantity >= quantityAvailable) {
        setQuantity(quantityAvailable)
        message.error('You have reached the maximum order!')
      } else {
        setQuantity(quantity + 1)
      }
    } else if (e === 'minus') {
      if (quantity === 1) {
        return
      } else {
        setQuantity(quantity - 1)
      }
    } else {
      // convert input value to number
      let quantity = parseInt(e.target.value, 10)
      const quantityAvailable = product.quantity - product.sold
      if (isNaN(quantity)) {
        setQuantity(0)
      } else if (quantity > quantityAvailable) {
        setQuantity(quantityAvailable)
        message.error('You have reached the maximum order!')
      } else {
        setQuantity(quantity)
      }
    }
  }

  const handleAddToCart = () => {
    // sample state
    // carts: [
    //   {
    //     quantity: 1,
    //     _id: 'abc',
    //     detail: {
    //       _id: 'abc',
    //       name: 'product',
    //     },
    //   },
    // ],
    const url = window.location.href
    const startIndex = url.indexOf('/product/') + '/product/'.length
    const extractedUrl = url.substring(startIndex)

    const productInformation = {
      quantity: quantity,
      _id: product._id,
      detail: product,
      url: extractedUrl,
    }

    dispatch(doAddToCart(productInformation))

    message.success('Add product to cart successfully!')
  }

  return (
    <>
      <div className="product-page-background">
        {isProductLoading === false && (
          <Row gutter={[15, 15]}>
            <Col
              className="product-detail-wrapper"
              xxl={12}
              xl={15}
              lg={18}
              md={22}
              sm={22}
              xs={24}
            >
              <div className="product-image-gallery">
                <ImageGallery
                  className="gallery-react"
                  ref={refGallery}
                  items={imagesGallery}
                  showNav={false}
                  autoPlay={false}
                  showPlayButton={false}
                  slideOnThumbnailOver={true}
                  onClick={onClickImage}
                  showFullscreenButton={false}
                />
              </div>
              <div className="product-detail-infomation">
                <Col className="product-seller">
                  Seller: <span>{product.author ? product.author : ''}</span>
                </Col>
                <Col className="product-title">
                  {product.mainText ? product.mainText : ''}
                </Col>
                <Col className="product-rating">
                  <Rate disabled value={5} />
                  <span>Sold {product.sold ? product.sold : ''}</span>
                </Col>
                <Col className="product-price">
                  ${product.price ? product.price : ''}
                </Col>
                <Col className="product-delivery">
                  <span
                    style={{ marginRight: 20, color: 'rgb(128, 128, 137)' }}
                  >
                    Delivery
                  </span>
                  FREE delivery{' '}
                  <span style={{ fontWeight: 'bold' }}>{dateDelivery}</span>
                </Col>
                <Col className="product-quantity">
                  <span
                    style={{ marginRight: 20, color: 'rgb(128, 128, 137)' }}
                  >
                    Quantity
                  </span>
                  <span className="quantity-right">
                    <button onClick={() => handleQuantity('minus')}>
                      <MinusOutlined />
                    </button>
                    <Input
                      value={quantity}
                      name="quantity"
                      min={0}
                      onChange={(e) => handleQuantity(e)}
                    />
                    <button onClick={() => handleQuantity('plus')}>
                      <PlusOutlined />
                    </button>
                  </span>
                </Col>

                <Col className="product-button">
                  <Button
                    type="primary"
                    onClick={() => {
                      handleAddToCart()
                      navigate('/cart')
                    }}
                  >
                    Buy Now
                  </Button>
                  <Button type="primary" onClick={handleAddToCart}>
                    <ShoppingCartOutlined />
                    Add to Cart
                  </Button>
                </Col>
              </div>
            </Col>
          </Row>
        )}

        <ModalGallery
          isOpenGalleryModal={isOpenGalleryModal}
          images={imagesGallery}
          closeModal={onClickImage}
          currentImage={currentImage}
          title={product.mainText}
        />

        {isProductLoading === true && <ProductLoader />}
      </div>
    </>
  )
}

export default ProductPage
