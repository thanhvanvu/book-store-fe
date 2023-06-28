import { Card, Col, Statistic } from 'antd'
import React from 'react'
import './Dashboard.scss'
import CountUp from 'react-countup'
import { useState } from 'react'
import { handleGetDashboardAdmin } from '../../../services/userService'
import { useEffect } from 'react'

const formatter = (value) => <CountUp end={value} separator="," />

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({})

  const getDashboard = async () => {
    const response = await handleGetDashboardAdmin()

    if (response?.data) {
      setDashboard(response.data)
    }
  }

  useEffect(() => {
    getDashboard()
  }, [])

  return (
    <Col className="dashboard-wrapper">
      <Card title="Total Users" bordered={false} style={{ width: 500 }}>
        <Statistic value={dashboard.countUser} formatter={formatter} />
      </Card>
      <Card title="Total Orders" bordered={false} style={{ width: 500 }}>
        <Statistic value={dashboard.countOrder} formatter={formatter} />
      </Card>
    </Col>
  )
}

export default Dashboard
