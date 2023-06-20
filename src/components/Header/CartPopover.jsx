import { Button, Col, Empty, Image, Popover, Row } from 'antd'
import React from 'react'
import './CartPopover.scss'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CartPopover = (props) => {
  const productsInCart = useSelector((state) => state.carts.products)
  const navigate = useNavigate()

  const handleRedirectBook = (url) => {
    navigate(`/product/${url}`)
  }

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
              style={{ width: 400 }}
              key={index}
              onClick={() => handleRedirectBook(product.url)}
            >
              <div className="product-info">
                <Image width={45} height={45} src={imageUrl} preview={false} />
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
        <Button type="primary">Go to cart</Button>
      </Col>
    </Col>
  )

  return (
    <Popover content={content} title="Added products to cart">
      <>{props.children}</>
    </Popover>
  )
}

export default CartPopover
