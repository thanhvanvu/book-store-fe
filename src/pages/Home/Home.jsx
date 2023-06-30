import {
  Col,
  Row,
  Form,
  Checkbox,
  Divider,
  Rate,
  Tabs,
  Pagination,
  Button,
  Drawer,
} from 'antd'
import {
  DownOutlined,
  FilterOutlined,
  ReloadOutlined,
  UpOutlined,
} from '@ant-design/icons'
import './Home.scss'
import { useEffect, useState } from 'react'

import {
  handleFetchCategory,
  handleGetProductWithFilter,
} from '../../services/productService'
import HomeLoader from './HomeLoader'
import HomeLoaderVertical from './HomeLoaderVertical'
import ProductItem from './ProductItem'
import ProductItemVertical from './ProductItemVertical'

const priceRange = [
  { label: 'Up to $20', value: '20' },
  { label: '$21 to $40', value: '40' },
  { label: '$41 to $60', value: '60' },
  { label: '$61 to $80', value: '80' },
  { label: '$81 to $100', value: '100' },
  { label: '$100 and above', value: 'infinity' },
]

const Home = () => {
  const [activeSortButton, setActiveSortButton] = useState('newest')
  const [productData, setProductData] = useState([])
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [isLoadingHomepage, setIsLoadingHomepage] = useState(false)
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

  const getProduct = async () => {
    setIsLoadingHomepage(true)
    const response = await handleGetProductWithFilter(
      pagination,
      categoryFilter,
      sort
    )
    if (response?.data) {
      setIsLoadingHomepage(false)
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

  // filter category
  useEffect(() => {
    categoryFilterAction()
  }, [categoryFilter])

  useEffect(() => {
    getProduct()
  }, [pagination.current, pagination.current, sort])

  const onChangePagination = (page, size) => {
    console.log(page, size)
    setPagination({
      ...pagination,
      current: page,
      pageSize: size,
    })
  }

  const handleSortButton = (type) => {
    setActiveSortButton(type)
    console.log(type)
    if (type === 'newest') {
      setSort('-createdAt')
    } else if (type === 'lowToHigh') {
      setSort('price')
    } else if (type === 'highToLow') {
      setSort('-price')
    }
  }

  return (
    <>
      <div className="homepage-background">
        <Row style={{ height: '100%' }}>
          <Col
            className="homepage-container"
            xxl={12}
            xl={15}
            lg={18}
            md={22}
            sm={22}
            xs={24}
          >
            <Col className="left-content" xl={5} lg={5} md={5} sm={0} xs={0}>
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

            <Col className="right-content" xl={19} md={19} sm={0} xs={0}>
              <Col className="product-content">
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
                          {isLoadingHomepage === false ? (
                            <Row className="right-content-wrapper">
                              {productData &&
                                productData.length > 0 &&
                                productData.map((product, index) => {
                                  {
                                    return (
                                      <ProductItem
                                        key={index}
                                        product={product}
                                      />
                                    )
                                  }
                                })}
                            </Row>
                          ) : (
                            <HomeLoader />
                          )}
                        </>
                      ),
                    },

                    {
                      key: 'lowToHigh',
                      label: `Price: Low to High`,
                      children: (
                        <>
                          {isLoadingHomepage === false ? (
                            <Row className="right-content-wrapper">
                              {productData &&
                                productData.length > 0 &&
                                productData.map((product, index) => {
                                  const thumbnail = `${
                                    import.meta.env.VITE_BACKEND_URL
                                  }/images/book/${product.thumbnail}`

                                  return (
                                    <ProductItem
                                      key={index}
                                      product={product}
                                    />
                                  )
                                })}
                            </Row>
                          ) : (
                            <HomeLoader />
                          )}
                        </>
                      ),
                    },
                    {
                      key: 'highToLow',
                      label: `Price: High to Low`,
                      children: (
                        <>
                          {isLoadingHomepage === false ? (
                            <Row className="right-content-wrapper">
                              {productData &&
                                productData.length > 0 &&
                                productData.map((product, index) => {
                                  return (
                                    <ProductItem
                                      key={index}
                                      product={product}
                                    />
                                  )
                                })}
                            </Row>
                          ) : (
                            <HomeLoader />
                          )}
                        </>
                      ),
                    },
                  ]}
                />
              </Col>

              <Col className="pagination">
                <Pagination
                  defaultCurrent={pagination.page}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={onChangePagination}
                />
              </Col>
            </Col>

            {/* vertical homepage */}
            <Col
              className="right-content-vertical"
              xl={0}
              lg={0}
              md={0}
              sm={24}
              xs={22}
            >
              <div className="filter">
                <span
                  className="filter-button"
                  onClick={() => setIsOpenFilter(!isOpenFilter)}
                >
                  Filter{' '}
                  {isOpenFilter === false ? <UpOutlined /> : <DownOutlined />}
                </span>

                <Drawer
                  title="Filter"
                  placement="bottom"
                  onClose={() => setIsOpenFilter(!isOpenFilter)}
                  open={isOpenFilter}
                  className="filter-drawer"
                >
                  <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: '100%' }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    className="filter-form-vertical"
                  >
                    <div className="feature-header">
                      <span style={{ fontWeight: 'bold' }}>Sort by</span>
                    </div>

                    <div className="feature-filter">
                      <button
                        className={
                          activeSortButton === 'newest' ? 'active' : ''
                        }
                        onClick={() => handleSortButton('newest')}
                      >
                        Newest Arrivals
                      </button>
                      <button
                        className={
                          activeSortButton === 'lowToHigh' ? 'active' : ''
                        }
                        onClick={() => handleSortButton('lowToHigh')}
                      >
                        Price: Low To High{' '}
                      </button>
                      <button
                        className={
                          activeSortButton === 'highToLow' ? 'active' : ''
                        }
                        onClick={() => handleSortButton('highToLow')}
                      >
                        Price: High To Low
                      </button>
                    </div>

                    <div className="category-header">
                      <span style={{ fontWeight: 'bold' }}>Category</span>
                      <ReloadOutlined
                        title="Reset"
                        className="icon-refresh"
                        onClick={() => {
                          setCategoryFilter([])
                          form.resetFields()
                          getProduct()
                        }}
                        style={{
                          color: '#CDAA1F',
                          cursor: 'pointer',
                        }}
                      />
                    </div>

                    <Form.Item labelCol={{ span: 24 }} name="category">
                      <Checkbox.Group
                        onChange={(checkedValues) =>
                          setCategoryFilter(checkedValues)
                        }
                        className="category-select-vertical"
                      >
                        {categorySelect &&
                          categorySelect.length > 0 &&
                          categorySelect.map((item, index) => {
                            return (
                              <div key={index}>
                                <Checkbox value={item.value}>
                                  {item.label}
                                </Checkbox>
                              </div>
                            )
                          })}
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

                    <Form.Item
                      labelCol={{ span: 24 }}
                      className="price-select-vertical"
                    >
                      {priceRange &&
                        priceRange.length > 0 &&
                        priceRange.map((price, index) => {
                          return (
                            <div key={index}>
                              <Checkbox
                                value={price.value}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                checked={price.value === priceFilter}
                              >
                                {price.label}
                              </Checkbox>
                            </div>
                          )
                        })}
                    </Form.Item>
                  </Form>
                </Drawer>
              </div>

              <Col className="product-content">
                {isLoadingHomepage === false ? (
                  <div>
                    {productData &&
                      productData.length > 0 &&
                      productData.map((product, index) => {
                        return (
                          <ProductItemVertical key={index} product={product} />
                        )
                      })}
                  </div>
                ) : (
                  <HomeLoaderVertical />
                )}
              </Col>

              <Col className="pagination">
                <Pagination
                  defaultCurrent={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={onChangePagination}
                />
              </Col>
            </Col>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Home
