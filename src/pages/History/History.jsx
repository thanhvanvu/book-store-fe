import { Col, Row, Space, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import './History.scss'
import { handleGetOrderHistory } from '../../services/productService'
import moment from 'moment'
import ReactJson from 'react-json-view'
const columns = [
  {
    title: 'Order number',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Order Placed',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: () => <Tag color="green">Success</Tag>,
  },
  {
    title: 'Detail',
    key: 'detail',

    render: (text, record) => (
      <ReactJson
        src={record.detail}
        collapsed={true}
        displayDataTypes={false}
        enableClipboard={false}
      />
    ),
  },
]

const data = [
  {
    key: '1',
    id: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

const History = () => {
  const [orderHistories, setOrderHistories] = useState([])
  const getOrderHistory = async () => {
    const response = await handleGetOrderHistory()

    if (response?.data) {
      const orderHistoriesArr = response.data
      let orderHistories = []
      orderHistoriesArr.map((history, index) => {
        let object = {}
        object.key = index
        object.id = history._id
        object.date = moment(new Date(history.createdAt)).format('MMMM Do YYYY')
        object.total = history.totalPrice
        object.detail = history

        orderHistories.push(object)
      })

      console.log(orderHistories)
      setOrderHistories(orderHistories)
    }
  }
  useEffect(() => {
    getOrderHistory()
  }, [])
  return (
    <div className="order-history-background">
      <Row gutter={[15, 15]}>
        <Col
          className="order-history-wrapper"
          xxl={15}
          xl={15}
          lg={18}
          md={22}
          sm={22}
          xs={24}
        >
          <Col span={24} className="history-title">
            Your Orders
          </Col>

          <Table
            columns={columns}
            dataSource={orderHistories}
            className="order-history-table"
          />
        </Col>
      </Row>
    </div>
  )
}

export default History
