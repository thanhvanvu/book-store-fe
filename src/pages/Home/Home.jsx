import {
  Col,
  Input,
  Row,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Rate,
  Tabs,
  Pagination,
} from 'antd'
import { FilterOutlined, MailOutlined, ReloadOutlined } from '@ant-design/icons'
import './Home.scss'
import { useState } from 'react'

const priceRange = [
  { label: 'Up to $20', value: '20' },
  { label: '$21 to $40', value: '40' },
  { label: '$41 to $60', value: '60' },
  { label: '$61 to $80', value: '80' },
  { label: '$81 to $100', value: '100' },
  { label: '$100 and above', value: 'infinity' },
]

const category = [
  { label: 'Up to $20', value: '20' },
  { label: '$21 to $40', value: '40' },
  { label: '$41 to $60', value: '60' },
  { label: '$61 to $80', value: '80' },
  { label: '$81 to $100', value: '100' },
  { label: '$100 and above', value: 'infinity' },
]

const Home = () => {
  const [priceFilter, setPriceFilter] = useState()
  const [categoryFilter, setCategoryFilter] = useState()
  const [form] = Form.useForm()

  const onChangeHeaderTab = (key) => {
    console.log(key)
  }

  const onChangePagination = (p, s) => {
    console.log(p, s)
  }

  return (
    <>
      <div className="homepage-background">
        <Row gutter={[20, 20]}>
          <Col className="homepage-container" span={20}>
            <Col className="left-content" md={4}>
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
                  <span style={{ fontWeight: 'bold' }}>Alphabet Filter</span>
                  <ReloadOutlined
                    className="icon-refresh"
                    onClick={() => {
                      form.resetFields()
                    }}
                    style={{ color: '#CDAA1F', cursor: 'pointer' }}
                  />
                </div>

                <Form.Item labelCol={{ span: 24 }} name="alphabetFilter">
                  <Col span={24}>
                    <Checkbox value="A">A</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="B">B</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="A">A</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="B">B</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="A">A</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="B">B</Checkbox>
                  </Col>
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

                <div className="price-range-header">
                  <span style={{ fontWeight: 'bold' }}>Category</span>
                  <ReloadOutlined
                    className="icon-refresh"
                    onClick={() => {
                      setCategoryFilter(null)
                    }}
                    style={{ color: '#CDAA1F', cursor: 'pointer' }}
                  />
                </div>

                <Form.Item labelCol={{ span: 24 }}>
                  {category &&
                    category.length > 0 &&
                    category.map((item, index) => {
                      return (
                        <Col span={24} key={index}>
                          <Checkbox
                            value={item.value}
                            checked={item.value === categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                          >
                            {item.label}
                          </Checkbox>
                        </Col>
                      )
                    })}
                </Form.Item>

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

            <Col className="right-content" md={20}>
              <Row>
                <Tabs
                  className="tab-header"
                  defaultActiveKey="1"
                  items={[
                    {
                      key: 'feature',
                      label: `Feature`,
                      children: (
                        <>
                          <Row className="right-content-wrapper">
                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>

                            <div className="product-wrapper">
                              <div className="product-thumbnail">
                                <img
                                  src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg"
                                  alt="thumbnail book"
                                />
                              </div>
                              <div className="product-information">
                                <div className="title">A Killer's Game</div>
                                <div>$ 8.52</div>
                                <div>
                                  FREE delivery{' '}
                                  <span style={{ fontWeight: 'bold' }}>
                                    Jun 16 - 23
                                  </span>
                                </div>
                                <div className="mail-shipping">
                                  <MailOutlined className="mail-icon" />
                                  <span>Fast Shipping in 2H</span>
                                </div>
                              </div>
                            </div>
                          </Row>
                        </>
                      ),
                    },
                    {
                      key: 'newest',
                      label: `Newest Arrivals`,
                      children: `Content of Tab Pane 2`,
                    },
                    {
                      key: 'lowToHigh',
                      label: `Price: Low to High`,
                      children: `Content of Tab Pane 3`,
                    },
                    {
                      key: 'highToLow',
                      label: `Price: High to Low`,
                      children: `Content of Tab Pane 4`,
                    },
                  ]}
                  onChange={onChangeHeaderTab}
                />
              </Row>

              <Row className="pagination">
                <Pagination
                  defaultCurrent={1}
                  pageSize={12}
                  total={100}
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
