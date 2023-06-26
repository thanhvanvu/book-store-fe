import {
  Button,
  Col,
  Divider,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Radio,
  Result,
  Row,
  Steps,
  message,
} from 'antd'

import './Cart.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {
  doDeleteToCart,
  doResetCart,
  doUpdateToCart,
} from '../../redux/cart/cartsSlice'

import { useNavigate } from 'react-router-dom'
import { handlePlaceOrder } from '../../services/userService'

const prefixSelector = (
  <Form.Item noStyle>
    <span>+1</span>
  </Form.Item>
)

const Cart = () => {
  const productsInCart = useSelector((state) => state.carts.products)
  const user = useSelector((state) => state.account.user)
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [orderSummary, setOrderSummary] = useState({
    tax: 0,
    orderTotal: 0,
    orderTotalAferTax: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showUpdate, setShowUpdate] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const navigate = useNavigate()

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

  const placeOrder = async (value) => {
    setIsLoading(true)

    let productArr = []
    if (products) {
      products.map((product) => {
        let productDetail = {}
        productDetail._id = product._id
        productDetail.quantity = product.quantity
        productDetail.bookName = product.detail.mainText

        productArr.push(productDetail)
      })
    }

    let orderApiInput = { ...value }

    orderApiInput.totalPrice = parseInt(orderSummary.orderTotalAferTax)
    orderApiInput.detail = productArr

    const response = await handlePlaceOrder(orderApiInput)
    if (response?.data) {
      dispatch(doResetCart())
      setIsLoading(false)
      setCurrentStep(currentStep + 1)
    }
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
          <Col>
            <Steps
              className="step-progress"
              size="small"
              current={currentStep}
              items={[
                {
                  title: 'Orders',
                },
                {
                  title: 'Check out',
                },
                {
                  title: 'Finish',
                },
              ]}
            />
          </Col>
          {currentStep === 0 || currentStep === 1 ? (
            <Col className="product-detail-wrapper">
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
                            $
                            {product?.detail?.price ? product.detail.price : ''}
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
                {currentStep === 0 && (
                  <div className="price-calulator">
                    <div className="order-title">Order Summary</div>
                    <div className="price-info-text">
                      <span>item ({products ? products.length : 0})</span>
                      <span>${orderSummary.orderTotal}</span>
                    </div>

                    <div className="price-info-text">
                      <span>Shipping & handling:</span>
                      <span>$0.00</span>
                    </div>

                    <Divider
                      orientation="left"
                      style={{ color: 'white', margin: 0 }}
                    >
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
                      <Button
                        type="primary"
                        onClick={() => {
                          if (user.id === '') {
                            navigate('/login')
                          } else {
                            setCurrentStep(currentStep + 1)
                          }
                        }}
                      >
                        Proceed to checkout
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="user-information">
                    <Form
                      form={form}
                      name="basic"
                      initialValues={{ remember: true }}
                      autoComplete="off"
                      onFinish={placeOrder}
                    >
                      <Form.Item
                        labelCol={{ span: 24 }}
                        label="Full name"
                        name="name"
                        initialValue={user.fullName}
                        rules={[
                          {
                            required: true,
                            message: 'Please input your full name!',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        labelCol={{ span: 24 }}
                        name="phone"
                        label="Phone Number"
                        initialValue={user.phone}
                        rules={[
                          {
                            required: true,
                            message: 'Please input your phone number!',
                          },
                        ]}
                      >
                        <Input
                          placeholder="281-485-7845"
                          addonBefore={prefixSelector}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>

                      <Form.Item
                        labelCol={{ span: 24 }}
                        label="Address"
                        name="address"
                        id="address"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your address!',
                          },
                        ]}
                      >
                        <Input placeholder="Street Address, State, Zipcode" />
                      </Form.Item>

                      <Form.Item
                        labelCol={{ span: 24 }}
                        label="Payment method"
                        rules={[
                          {
                            required: true,
                            message: 'Please select payment method!',
                          },
                        ]}
                      >
                        <Radio value="payment" checked>
                          Pay when receive the order
                        </Radio>
                      </Form.Item>

                      <Divider></Divider>

                      <div className="price-info-text">
                        <span className="order-total-text">Order total:</span>
                        <span className="order-total-text">
                          ${orderSummary.orderTotalAferTax}
                        </span>
                      </div>

                      <div className="place-order">
                        <Button
                          type="primary"
                          onClick={() => form.submit()}
                          loading={isLoading}
                        >
                          Place your order
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => setCurrentStep(currentStep - 1)}
                        >
                          Go back
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}
              </Col>
            </Col>
          ) : (
            <>
              <Result
                status="success"
                title="Successfully Placed order from Bookstore!"
                subTitle="Order number: 2017182818828182881"
                extra={[
                  <Button
                    type="primary"
                    key="console"
                    onClick={() => navigate('/history')}
                  >
                    Check history
                  </Button>,
                  <Button key="homepage" onClick={() => navigate('/')}>
                    Buy Again
                  </Button>,
                ]}
              />
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default Cart
