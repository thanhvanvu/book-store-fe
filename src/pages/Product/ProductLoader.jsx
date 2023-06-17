import { Col, Row, Skeleton } from 'antd'
import React from 'react'
import './ProductLoader.scss'

const ProductLoader = () => {
  return (
    <Row gutter={[15, 15]}>
      <Col
        className="wrapper-loader"
        xxl={15}
        xl={15}
        lg={18}
        md={22}
        sm={22}
        xs={23}
      >
        <Col
          className="left-loader"
          xxl={12}
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={24}
        >
          <Skeleton.Input
            active={true}
            block={true}
            className="left-image-loader"
            style={{ height: 400 }}
          />
          <Col className="thumbnail-loader" sm={0}>
            <Skeleton.Image active={true} />
            <Skeleton.Image active={true} />
            <Skeleton.Image active={true} />
          </Col>
        </Col>

        <Col
          className="right-loader"
          xxl={12}
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={24}
        >
          <Skeleton active={true} />
          <Skeleton active={true} style={{ marginTop: 30 }} />

          <div className="button-loader">
            <Skeleton.Button
              active={true}
              shape="round"
              style={{ width: 100 }}
            />
            <Skeleton.Button
              active={true}
              shape="round"
              style={{ width: 100 }}
            />
          </div>
        </Col>
      </Col>
    </Row>
  )
}

export default ProductLoader
