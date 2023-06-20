import {
  Col,
  Row,
  Form,
  Checkbox,
  Divider,
  Rate,
  Tabs,
  Pagination,
  Image,
} from 'antd'
import { FilterOutlined, MailOutlined, ReloadOutlined } from '@ant-design/icons'
import './Home.scss'
import { useEffect, useState } from 'react'
import moment from 'moment'
import {
  handleFetchCategory,
  handleGetProductWithFilter,
} from '../../services/productService'
import { useNavigate } from 'react-router-dom'

// convert vietnamese accent
const nonAccentVietnamese = (str) => {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A')
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/Đ/g, 'D')
  str = str.replace(/đ/g, 'd')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
  return str
}

const convertSlug = (str) => {
  str = nonAccentVietnamese(str)
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;'
  const to =
    'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

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
  const navigate = useNavigate()
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
    console.log(page, size)
    setPagination({
      ...pagination,
      current: page,
      pageSize: size,
    })
  }

  const date = moment(new Date()).format('MMMM DD')
  const dateDelivery = `${date} - ${new Date().getDate() + 10}`

  const handleRedirectBook = (product) => {
    // build slug
    const slug = convertSlug(product.mainText)

    navigate(`/product/${slug}?id=${product._id}`)
  }

  const productContent = () => {
    return (
      <>
        {productData &&
          productData.length > 0 &&
          productData.map((product, index) => {
            const thumbnail = `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${product.thumbnail}`
            return (
              <div className="product-content-wrapper" key={index}>
                <div className="product-thumbnail">
                  <Image src={thumbnail} width={200} height={200} />
                </div>
                <div className="product-information">
                  <div className="product-title">{product.mainText}</div>
                  <div className="product-price">${product.price}</div>
                  <div>
                    FREE delivery{' '}
                    <span style={{ fontWeight: 'bold' }}>{dateDelivery}</span>
                  </div>
                  <div className="mail-shipping">
                    <MailOutlined className="mail-icon" />
                    <span>Fast Shipping in 2H</span>
                  </div>
                </div>
              </div>
            )
          })}
      </>
    )
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
                          <Row className="right-content-wrapper">
                            {productData &&
                              productData.length > 0 &&
                              productData.map((product, index) => {
                                const thumbnail = `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/book/${product.thumbnail}`

                                return (
                                  <div
                                    className="product-wrapper"
                                    key={index}
                                    onClick={() => handleRedirectBook(product)}
                                  >
                                    <div className="product-thumbnail">
                                      <Image
                                        src={thumbnail}
                                        height={200}
                                        preview={false}
                                      />
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
                                  <div
                                    className="product-wrapper"
                                    key={index}
                                    onClick={() => handleRedirectBook(product)}
                                  >
                                    <div className="product-thumbnail">
                                      <Image
                                        src={thumbnail}
                                        height={200}
                                        preview={false}
                                      />
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
                                  <div
                                    className="product-wrapper"
                                    key={index}
                                    onClick={() => handleRedirectBook(product)}
                                  >
                                    <div className="product-thumbnail">
                                      <Image
                                        src={thumbnail}
                                        height={200}
                                        preview={false}
                                      />
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
                          {productData &&
                            productData.length > 0 &&
                            productData.map((product, index) => {
                              const thumbnail = `${
                                import.meta.env.VITE_BACKEND_URL
                              }/images/book/${product.thumbnail}`
                              return (
                                <div
                                  className="product-content-wrapper"
                                  key={index}
                                  onClick={() => handleRedirectBook(product)}
                                >
                                  <div className="product-thumbnail">
                                    <Image
                                      src={thumbnail}
                                      width={100}
                                      preview={false}
                                    />
                                  </div>
                                  <div className="product-information">
                                    <div className="product-title">
                                      {product.mainText}
                                    </div>
                                    <div className="product-price">
                                      ${product.price}
                                    </div>
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
                        </>
                      ),
                    },

                    {
                      key: 'lowToHigh',
                      label: `Price: Low to High`,
                      children: (
                        <>
                          {productData &&
                            productData.length > 0 &&
                            productData.map((product, index) => {
                              const thumbnail = `${
                                import.meta.env.VITE_BACKEND_URL
                              }/images/book/${product.thumbnail}`
                              return (
                                <div
                                  className="product-content-wrapper"
                                  key={index}
                                  onClick={() => handleRedirectBook(product)}
                                >
                                  <div className="product-thumbnail">
                                    <Image
                                      src={thumbnail}
                                      width={100}
                                      preview={false}
                                    />
                                  </div>
                                  <div className="product-information">
                                    <div className="product-title">
                                      {product.mainText}
                                    </div>
                                    <div className="product-price">
                                      ${product.price}
                                    </div>
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
                        </>
                      ),
                    },

                    {
                      key: 'highToLow',
                      label: `Price: High to Low`,
                      children: (
                        <>
                          {productData &&
                            productData.length > 0 &&
                            productData.map((product, index) => {
                              const thumbnail = `${
                                import.meta.env.VITE_BACKEND_URL
                              }/images/book/${product.thumbnail}`
                              return (
                                <div
                                  className="product-content-wrapper"
                                  key={index}
                                  onClick={() => handleRedirectBook(product)}
                                >
                                  <div className="product-thumbnail">
                                    <Image
                                      src={thumbnail}
                                      width={100}
                                      preview={false}
                                    />
                                  </div>
                                  <div className="product-information">
                                    <div className="product-title">
                                      {product.mainText}
                                    </div>
                                    <div className="product-price">
                                      ${product.price}
                                    </div>
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
                        </>
                      ),
                    },
                  ]}
                />
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
