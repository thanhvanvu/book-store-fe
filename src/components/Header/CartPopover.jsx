import { Button, Col, Empty, Image, Popover } from 'antd'
import './CartPopover.scss'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const CartPopover = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [popoverWidth, setPopoverWidth] = useState(0)
  const [popoverPlacement, setPopoverPlacement] = useState('bottom')

  const productsInCart = useSelector((state) => state.carts.products)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
  }, [])

  const setVwModal = () => {
    let width = windowWidth
    if (width >= 1600) {
      setPopoverWidth(400)
    } else if (width >= 600 && width < 1600) {
      setPopoverWidth(350)
    } else if (width >= 400 && width < 600) {
      setPopoverWidth(300)
    } else if (width < 400) {
      setPopoverWidth(200)
      setPopoverPlacement('bottomRight')
    }
  }

  useEffect(() => {
    setVwModal()
  }, [windowWidth])

  const content = (
    <Col>
      {productsInCart && productsInCart.length > 0 ? (
        productsInCart.map((product, index) => {
          const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            product.detail.thumbnail
          }`
          return (
            <div
              className="product-cart-detail"
              style={{ width: popoverWidth }}
              key={index}
              onClick={() => handleRedirectBook(product.url)}
            >
              <div className="product-info">
                <Image width={45} src={imageUrl} preview={false} />
                <p className="product-name">{product.detail.mainText}</p>
              </div>
              <div className="product-price">${product.detail.price}</div>
            </div>
          )
        })
      ) : (
        <>
          <Empty description="Cart empty" />
        </>
      )}
      <Col style={{ display: 'flex', justifyContent: 'right' }}>
        <Button type="primary" onClick={() => navigate('/cart')}>
          Go to cart
        </Button>
      </Col>
    </Col>
  )

  const handleRedirectBook = (url) => {
    navigate(`/product/${url}`)
  }

  return (
    <Popover
      content={content}
      title="Added products to cart"
      placement={popoverPlacement}
    >
      <>{props.children}</>
    </Popover>
  )
}

export default CartPopover
