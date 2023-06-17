import React, { useEffect, useRef, useState } from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/scss/image-gallery.scss'
import { Col, Divider, Image, Modal, Row } from 'antd'
import './ProductPage.scss'
const ModalGallery = (props) => {
  const { isOpenGalleryModal, images, closeModal, currentImage, title } = props
  const [activeImage, setActiveImage] = useState(0)
  const refGallery = useRef()

  useEffect(() => {
    setActiveImage(currentImage)
  }, [isOpenGalleryModal, currentImage])
  return (
    <Modal
      width={'70vw'}
      title="IMAGES"
      open={isOpenGalleryModal}
      // onOk={isOpenGalleryModal}
      onCancel={closeModal}
      footer={null} //hide footer
      // closable={false} //hide close button
    >
      <Divider></Divider>

      <Row gutter={[20, 20]}>
        <Col span={16}>
          <ImageGallery
            ref={refGallery}
            showThumbnails={false}
            autoPlay={false}
            showPlayButton={false}
            items={images}
            startIndex={currentImage}
          />
        </Col>
        <Col span={8}>
          <div className="product-title">{title}</div>
          <Row gutter={[20, 20]}>
            {images &&
              images.length > 0 &&
              images.map((image, index) => {
                return (
                  <Col key={index}>
                    <Image
                      className={activeImage === index ? 'active' : ''}
                      width={100}
                      src={image.original}
                      preview={false}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setActiveImage(index)
                        refGallery.current.slideToIndex(index)
                      }}
                    />
                  </Col>
                )
              })}
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalGallery
