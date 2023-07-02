import React, { useEffect, useRef, useState } from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/scss/image-gallery.scss'
import { Col, Divider, Image, Modal, Row } from 'antd'
import './ProductPage.scss'
const ModalGallery = (props) => {
  const { isOpenGalleryModal, images, closeModal, currentImage, title } = props
  const [activeImage, setActiveImage] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [modalWidth, setModalWidth] = useState('')
  const refGallery = useRef()

  // Update the window width state on window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
  }, [])

  const setVwModal = () => {
    let width = windowWidth
    if (width >= 1600) {
      setModalWidth('30vw')
    } else if (width >= 700 && width < 1600) {
      setModalWidth('50vw')
    } else if (width < 700) {
      setModalWidth('90vw')
    }
  }

  useEffect(() => {
    setVwModal()
  }, [windowWidth])

  useEffect(() => {
    setActiveImage(currentImage)
  }, [isOpenGalleryModal, currentImage])

  return (
    <Modal
      width={modalWidth}
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
