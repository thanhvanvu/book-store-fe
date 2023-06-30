import React from 'react'
import { convertSlug } from '../../utils/commonFunction'
import { useNavigate } from 'react-router-dom'
import { Image } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import moment from 'moment'
import './ProductItemVertical.scss'

const ProductItemVertical = (props) => {
  const navigate = useNavigate()

  const product = props.product

  const handleRedirectBook = (product) => {
    // build slug
    const slug = convertSlug(product.mainText)

    navigate(`/product/${slug}?id=${product._id}`)
  }

  const date = moment(new Date()).format('MMMM DD')
  const dateDelivery = `${date} - ${new Date().getDate() + 10}`

  const thumbnail = `${import.meta.env.VITE_BACKEND_URL}/images/book/${
    product.thumbnail
  }`

  return (
    <div
      className="product-content-wrapper"
      onClick={() => handleRedirectBook(product)}
    >
      <div className="product-thumbnail">
        <Image src={thumbnail} width={100} preview={false} />
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
}

export default ProductItemVertical
