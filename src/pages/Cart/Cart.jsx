import { Button, Col, Divider, Empty, Image, InputNumber, Row } from 'antd'

import './Cart.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { doDeleteToCart, doUpdateToCart } from '../../redux/cart/cartsSlice'
const Cart = () => {
  const productsInCart = useSelector((state) => state.carts.products)
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [orderSummary, setOrderSummary] = useState({
    tax: 0,
    orderTotal: 0,
    orderTotalAferTax: 0,
  })
  const [showUpdate, setShowUpdate] = useState([])

  const getTotalPrice = async () => {
    let totalPriceInCart = 0
    let tax = 0
    let orderTotalAferTax = 0
    if (productsInCart) {
      await productsInCart.map((product) => {
        let totalPrice = product.quantity * product.detail.price
        totalPriceInCart += totalPrice
      })

      tax = totalPriceInCart * 0.08
      orderTotalAferTax = tax + totalPriceInCart
    }

    setOrderSummary({
      tax: tax.toFixed(2),
      orderTotal: totalPriceInCart.toFixed(2),
      orderTotalAferTax: orderTotalAferTax.toFixed(2),
    })
  }

  useEffect(() => {
    getTotalPrice(products)
    setProducts(productsInCart)
  }, [productsInCart])

  const handleChangeQuantity = (value, product, productIndex) => {
    if (!value || value < 1) return

    //#region  show update button
    let showUpdateInfo = {
      index: productIndex,
      isShow: true,
    }
    //find if showUpdate has it already
    const isExist = showUpdate.some((item) => item.index === productIndex)
    if (!isExist) {
      setShowUpdate((prevShowUpdate) => [...prevShowUpdate, showUpdateInfo])
    }
    //#endregion

    // update state products with new item
    const updatedProducts = products.map((item) => {
      if (item._id === product._id) {
        return { ...item, quantity: value }
      }
      return item
    })

    setProducts(updatedProducts)
  }

  const handleUpdateQuantity = (indexButton) => {
    dispatch(doUpdateToCart(products))

    // hide update button after updated
    let showButtonUpdated = []
    showUpdate.map((item) => {
      if (item.index !== indexButton) {
        showButtonUpdated.push(item)
      }
    })

    setShowUpdate(showButtonUpdated)
  }

  const handleDeleteProduct = (product) => {
    dispatch(doDeleteToCart(product))
  }
  return (
    <div className="product-cart-background">
      <Row gutter={[15, 15]}>
        <Col
          className="product-cart-wrapper"
          xxl={12}
          xl={15}
          lg={18}
          md={22}
          sm={22}
          xs={24}
        >
          {products && products.length > 0 ? (
            <Col xl={16} className="product-detail-left">
              {products &&
                products.length > 0 &&
                products.map((product, index) => {
                  let maximumQuantity = 0
                  let thumbnail = ''

                  if (product?.detail?.thumbnail) {
                    thumbnail = `${
                      import.meta.env.VITE_BACKEND_URL
                    }/images/book/${product.detail.thumbnail}`
                  }

                  if (product?.detail) {
                    maximumQuantity =
                      product.detail.quantity - product.detail.sold
                  }
                  return (
                    <div className="product-information" key={index}>
                      <div className="product-detail-wrap">
                        <Image width={100} src={thumbnail} />
                        <div className="product-detail">
                          <div className="product-name">
                            {product?.detail?.mainText
                              ? product.detail.mainText
                              : ''}
                          </div>

                          <div className="seller">
                            {product?.detail?.author
                              ? product.detail.author
                              : ''}
                          </div>

                          <div className="quantity">
                            <InputNumber
                              className="product-quantity"
                              size="small"
                              value={product.quantity}
                              min={0}
                              max={maximumQuantity}
                              onChange={(value) =>
                                handleChangeQuantity(value, product, index)
                              }
                            />

                            {showUpdate &&
                              showUpdate.length > 0 &&
                              showUpdate.map((item, indexUpdateButton) => {
                                if (item.index === index) {
                                  return (
                                    <span
                                      className="update-quantity"
                                      onClick={() =>
                                        handleUpdateQuantity(index)
                                      }
                                      key={indexUpdateButton}
                                    >
                                      Update
                                    </span>
                                  )
                                }
                              })}
                          </div>

                          <span
                            className="product-delete"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            Delete
                          </span>
                        </div>
                      </div>
                      <div className="product-price">
                        ${product?.detail?.price ? product.detail.price : ''}
                      </div>
                    </div>
                  )
                })}
            </Col>
          ) : (
            <>
              <Col xl={16}>
                {' '}
                <Empty description="Your Cart is empty." />
              </Col>
            </>
          )}

          <Col xl={8} className="product-detail-right">
            <div className="order-title">Order Summary</div>
            <div className="price-info-text">
              <span>item ({products ? products.length : 0})</span>
              <span>${orderSummary.orderTotal}</span>
            </div>

            <div className="price-info-text">
              <span>Shipping & handling:</span>
              <span>$0.00</span>
            </div>

            <Divider orientation="left" style={{ color: 'white', margin: 0 }}>
              1111111111111111111111111111
            </Divider>

            <div className="price-info-text">
              <span>Total before tax:</span>
              <span>${orderSummary.orderTotal}</span>
            </div>

            <div className="price-info-text">
              <span>Estimated tax to be collected:</span>
              <span>${orderSummary.tax}</span>
            </div>

            <Divider />

            <div className="price-info-text">
              <span className="order-total-text">Order total:</span>
              <span className="order-total-text">
                ${orderSummary.orderTotalAferTax}
              </span>
            </div>

            <div className="place-order">
              <Button type="primary"> Place your order</Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Cart
