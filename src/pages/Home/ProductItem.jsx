import React from 'react'
import './ProductItem.scss'
import { convertSlug } from '../../utils/commonFunction'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Image } from 'antd'
import { MailOutlined } from '@ant-design/icons'

const ProductItem = (props) => {
  const navigate = useNavigate()
  const product = props.product
  const thumbnail = `${import.meta.env.VITE_BACKEND_URL}/images/book/${
    product.thumbnail
  }`

  const date = moment(new Date()).format('MMMM DD')
  const dateDelivery = `${date} - ${new Date().getDate() + 10}`

  const handleRedirectBook = (product) => {
    // build slug
    const slug = convertSlug(product.mainText)

    navigate(`/product/${slug}?id=${product._id}`)
  }
  return (
    <div
      className="product-wrapper"
      onClick={() => handleRedirectBook(product)}
    >
      <div className="product-thumbnail">
        <Image src={thumbnail} height={200} preview={false} />
      </div>
      <div className="product-information">
        <div className="title">{product.mainText}</div>
        <div>${product.price}</div>
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

export default ProductItem
