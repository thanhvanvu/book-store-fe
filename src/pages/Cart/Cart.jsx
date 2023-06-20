import { Button, Col, Divider, Image, Input, Row } from 'antd'
import React from 'react'
import './Cart.scss'
const Cart = () => {
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
          <Col xl={16} className="product-detail-left">
            <div className="product-information">
              <div className="product-detail-wrap">
                <Image
                  width={100}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <div className="product-detail">
                  <div className="product-name">
                    Summer Bridge Activities 5th to 6th Grade Workbooks
                  </div>
                  <Input className="product-quantity" size="small"></Input>
                  <div className="product-delete">Delete</div>
                </div>
              </div>
              <div className="product-price">$20</div>
            </div>

            <div className="product-information">
              <div className="product-detail-wrap">
                <Image
                  width={100}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <div className="product-detail">
                  <div className="product-name">
                    Summer Bridge Activities 5th to 6th Grade Workbooks
                  </div>
                  <Input className="product-quantity" size="small"></Input>
                  <div className="product-delete">Delete</div>
                </div>
              </div>
              <div className="product-price">$20</div>
            </div>

            <div className="product-information">
              <div className="product-detail-wrap">
                <Image
                  width={100}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <div className="product-detail">
                  <div className="product-name">
                    Summer Bridge Activities 5th to 6th Grade Workbooks
                  </div>
                  <Input className="product-quantity" size="small"></Input>
                  <div className="product-delete">Delete</div>
                </div>
              </div>
              <div className="product-price">$20</div>
            </div>
          </Col>
          <Col xl={8} className="product-detail-right">
            <div className="order-title">Order Summary</div>
            <div className="price-info-text">
              <span>item (2)</span>
              <span>$25</span>
            </div>

            <div className="price-info-text">
              <span>Shipping & handling:</span>
              <span>$25</span>
            </div>

            <Divider orientation="left" style={{ color: 'white', margin: 0 }}>
              1111111111111111111111111111
            </Divider>

            <div className="price-info-text">
              <span>Total before tax:</span>
              <span>$25</span>
            </div>

            <div className="price-info-text">
              <span>Estimated tax to be collected:</span>
              <span>$25</span>
            </div>

            <Divider />

            <div className="price-info-text">
              <span className="order-total-text">Order total:</span>
              <span className="order-total-text">$25</span>
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
