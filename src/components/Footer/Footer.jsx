import React from 'react'
import './Footer.scss'
import { Col } from 'antd'
import { AiFillGithub } from 'react-icons/ai'

const Footer = () => {
  return (
    <div className="home-footer">
      <Col span={20} className="home-footer-content">
        <p>&copy; 2023 Thanh Vu.</p>
        <a target="/blank" href="https://github.com/vvt4994">
          <AiFillGithub />
        </a>
      </Col>
    </div>
  )
}

export default Footer
