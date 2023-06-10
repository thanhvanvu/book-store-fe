import { Col, Row, Form, Checkbox, Divider, Rate, Tabs, Pagination } from 'antd'
import { FilterOutlined, MailOutlined, ReloadOutlined } from '@ant-design/icons'
import './Home.scss'
import { useEffect, useState } from 'react'
import moment from 'moment'
import {
  handleFetchCategory,
  handleGetProductWithFilter,
  handleSearchProductWithPaginate,
  handleSortProductWithPaginate,
} from '../../services/productService'

const priceRange = [
  { label: 'Up to $20', value: '20' },
  { label: '$21 to $40', value: '40' },
  { label: '$41 to $60', value: '60' },
  { label: '$61 to $80', value: '80' },
  { label: '$81 to $100', value: '100' },
  { label: '$100 and above', value: 'infinity' },
]

const Home = () => {
  const [productData, setProductData] = useState([])

  const [categorySelect, setCategorySelect] = useState()
  const [priceFilter, setPriceFilter] = useState()
  const [categoryFilter, setCategoryFilter] = useState([])
  const [form] = Form.useForm()
  const [sort, setSort] = useState('-createdAt')
  const [pagination, setPagination] = useState({
    pageSize: 9,
    current: 1,
    total: 0,
  })

  const getProduct = async () => {
    const response = await handleGetProductWithFilter(
      pagination,
      categoryFilter,
      sort
    )
    if (response?.data) {
      const meta = response.data.meta

      setPagination({
        current: meta.current,
        pageSize: meta.pageSize,
        total: meta.total,
      })
      setProductData(response.data.result)
    }
  }

  const categoryFilterAction = async () => {
    if (categoryFilter && categoryFilter.length === 0) {
      await getProduct()
    } else {
      const categoryQuery = categoryFilter.join(',')

      const response = await handleGetProductWithFilter(
        pagination,
        categoryQuery,
        sort
      )
      if (response?.data?.result) {
        setProductData(response.data.result)
      }
    }
  }

  useEffect(() => {
    getProduct()
  }, [pagination.current, pagination.current, sort])

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

  // filter category
  useEffect(() => {
    categoryFilterAction()
  }, [categoryFilter])

  const onChangePagination = (page, size) => {
    setPagination({
      ...pagination,
      page: page,
      pageSize: size,
    })
  }

  const date = moment(new Date()).format('MMMM DD')
  const dateDelivery = `${date} - ${new Date().getDate() + 10}`

  return (
    <>
      <div className="homepage-background">
        <Row gutter={[20, 20]}>
          <Col className="homepage-container" span={20}>
            <Col className="left-content" md={4} sm={0}>
              <div className="filter-header">
                <span style={{ fontWeight: 'bold' }}>
                  {' '}
                  <FilterOutlined
                    style={{ color: '#CDAA1F', cursor: 'pointer' }}
                  />{' '}
                  Filter tool
                </span>
              </div>

              <Form
                form={form}
                name="basic"
                style={{ maxWidth: '100%', marginTop: 10 }}
                initialValues={{ remember: true }}
                autoComplete="off"
              >
                <div className="alphabet-header">
                  <span style={{ fontWeight: 'bold' }}>Category</span>
                  <ReloadOutlined
                    title="Reset"
                    className="icon-refresh"
                    onClick={() => {
                      setCategoryFilter([])
                      form.resetFields()
                      getProduct()
                    }}
                    style={{ color: '#CDAA1F', cursor: 'pointer' }}
                  />
                </div>

                <Form.Item labelCol={{ span: 24 }} name="category">
                  <Checkbox.Group
                    onChange={(checkedValues) =>
                      setCategoryFilter(checkedValues)
                    }
                  >
                    <Row>
                      {categorySelect &&
                        categorySelect.length > 0 &&
                        categorySelect.map((item, index) => {
                          return (
                            <Col span={24} key={index}>
                              <Checkbox value={item.value}>
                                {item.label}
                              </Checkbox>
                            </Col>
                          )
                        })}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>

                <Divider></Divider>

                <div className="price-range-header">
                  <span style={{ fontWeight: 'bold' }}>Price Range</span>
                  <ReloadOutlined
                    className="icon-refresh"
                    onClick={() => {
                      setPriceFilter(null)
                    }}
                    style={{ color: '#CDAA1F', cursor: 'pointer' }}
                  />
                </div>

                <Form.Item labelCol={{ span: 24 }}>
                  {priceRange &&
                    priceRange.length > 0 &&
                    priceRange.map((price, index) => {
                      return (
                        <Col span={24} key={index}>
                          <Checkbox
                            value={price.value}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            checked={price.value === priceFilter}
                          >
                            {price.label}
                          </Checkbox>
                        </Col>
                      )
                    })}
                </Form.Item>

                <Divider></Divider>

                <span
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 10,
                    display: 'block',
                  }}
                >
                  Customer Reviews
                </span>
                <Form.Item labelCol={{ span: 24 }}>
                  <div>
                    <Rate
                      value={5}
                      disabled
                      style={{ color: '#ffce3d', fontSize: 15 }}
                    />
                    <span className="ant-rate-text"></span>
                  </div>
                  <div>
                    <Rate
                      value={4}
                      disabled
                      style={{ color: '#ffce3d', fontSize: 15 }}
                    />
                    <span className="ant-rate-text">& Up</span>
                  </div>
                  <div>
                    <Rate
                      value={3}
                      disabled
                      style={{ color: '#ffce3d', fontSize: 15 }}
                    />
                    <span className="ant-rate-text">& Up</span>
                  </div>
                  <div>
                    <Rate
                      value={2}
                      disabled
                      style={{ color: '#ffce3d', fontSize: 15 }}
                    />
                    <span className="ant-rate-text">& Up</span>
                  </div>
                  <div>
                    <Rate
                      value={1}
                      disabled
                      style={{ color: '#ffce3d', fontSize: 15 }}
                    />
                    <span className="ant-rate-text">& Up</span>
                  </div>
                </Form.Item>
              </Form>
            </Col>

            <Col className="right-content" md={20} sm={24}>
              <Row>
                <Tabs
                  onChange={(activeKey) => {
                    if (activeKey === 'lowToHigh') {
                      setSort('price')
                    } else if (activeKey === 'highToLow') {
                      setSort('-price')
                    } else {
                      setSort('-createdAt')
                    }
                  }}
                  className="tab-header"
                  defaultActiveKey="newest"
                  items={[
                    {
                      key: 'newest',
                      label: `Newest Arrivals`,
                      children: (
                        <>
                          <Row className="right-content-wrapper">
                            {productData &&
                              productData.length > 0 &&
                              productData.map((product, index) => {
                                const thumbnail = `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/book/${product.thumbnail}`
                                return (
                                  <div className="product-wrapper" key={index}>
                                    <div className="product-thumbnail">
                                      <img src={thumbnail} />
                                    </div>
                                    <div className="product-information">
                                      <div className="title">
                                        {product.mainText}
                                      </div>
                                      <div>${product.price}</div>
                                      <div>
                                        FREE delivery{' '}
                                        <span style={{ fontWeight: 'bold' }}>
                                          {dateDelivery}
                                        </span>
                                      </div>
                                      <div className="mail-shipping">
                                        <MailOutlined className="mail-icon" />
                                        <span>Fast Shipping in 2H</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                          </Row>
                        </>
                      ),
                    },

                    {
                      key: 'lowToHigh',
                      label: `Price: Low to High`,
                      children: (
                        <>
                          <Row className="right-content-wrapper">
                            {productData &&
                              productData.length > 0 &&
                              productData.map((product, index) => {
                                const thumbnail = `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/book/${product.thumbnail}`
                                return (
                                  <div className="product-wrapper" key={index}>
                                    <div className="product-thumbnail">
                                      <img src={thumbnail} />
                                    </div>
                                    <div className="product-information">
                                      <div className="title">
                                        {product.mainText}
                                      </div>
                                      <div>${product.price}</div>
                                      <div>
                                        FREE delivery{' '}
                                        <span style={{ fontWeight: 'bold' }}>
                                          {dateDelivery}
                                        </span>
                                      </div>
                                      <div className="mail-shipping">
                                        <MailOutlined className="mail-icon" />
                                        <span>Fast Shipping in 2H</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                          </Row>
                        </>
                      ),
                    },
                    {
                      key: 'highToLow',
                      label: `Price: High to Low`,
                      children: (
                        <>
                          <Row className="right-content-wrapper">
                            {productData &&
                              productData.length > 0 &&
                              productData.map((product, index) => {
                                const thumbnail = `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/book/${product.thumbnail}`
                                return (
                                  <div className="product-wrapper" key={index}>
                                    <div className="product-thumbnail">
                                      <img src={thumbnail} />
                                    </div>
                                    <div className="product-information">
                                      <div className="title">
                                        {product.mainText}
                                      </div>
                                      <div>${product.price}</div>
                                      <div>
                                        FREE delivery{' '}
                                        <span style={{ fontWeight: 'bold' }}>
                                          {dateDelivery}
                                        </span>
                                      </div>
                                      <div className="mail-shipping">
                                        <MailOutlined className="mail-icon" />
                                        <span>Fast Shipping in 2H</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                          </Row>
                        </>
                      ),
                    },
                  ]}
                />
              </Row>

              <Row className="pagination">
                <Pagination
                  defaultCurrent={pagination.page}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={onChangePagination}
                />
              </Row>
            </Col>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Home
