import { ReloadOutlined } from '@ant-design/icons'
import { Checkbox, Divider, Drawer, Form } from 'antd'
import React from 'react'
import { useState } from 'react'
import './FilterDrawer.scss'

const FilterDrawer = (props) => {
  const {
    isOpenFilter,
    handleFilterDrawer,
    handleSortByFilter,
    categorySelect,
    handleCategoryFilter,
  } = props
  const [activeSortButton, setActiveSortButton] = useState('newest')
  const [form] = Form.useForm()

  const handleSortButton = (type) => {
    setActiveSortButton(type)

    if (type === 'newest') {
      handleSortByFilter('-createdAt')
    } else if (type === 'lowToHigh') {
      handleSortByFilter('price')
    } else if (type === 'highToLow') {
      handleSortByFilter('-price')
    }
  }

  const handleChangeCategoryFilter = (category) => {
    handleCategoryFilter(category)
  }
  return (
    <Drawer
      title="Filter"
      placement="bottom"
      onClose={() => handleFilterDrawer()}
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
            className={activeSortButton === 'newest' ? 'active' : ''}
            onClick={() => handleSortButton('newest')}
          >
            Newest Arrivals
          </button>
          <button
            className={activeSortButton === 'lowToHigh' ? 'active' : ''}
            onClick={() => handleSortButton('lowToHigh')}
          >
            Price: Low To High{' '}
          </button>
          <button
            className={activeSortButton === 'highToLow' ? 'active' : ''}
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
              handleChangeCategoryFilter([])
              form.resetFields()
              // getProduct()
            }}
            style={{
              color: '#CDAA1F',
              cursor: 'pointer',
            }}
          />
        </div>

        <Form.Item labelCol={{ span: 24 }} name="category">
          <Checkbox.Group
            onChange={handleChangeCategoryFilter}
            className="category-select-vertical"
          >
            {categorySelect &&
              categorySelect.length > 0 &&
              categorySelect.map((item, index) => {
                return (
                  <div key={index}>
                    <Checkbox value={item.value}>{item.label}</Checkbox>
                  </div>
                )
              })}
          </Checkbox.Group>
        </Form.Item>

        <Divider></Divider>

        {/* <div className="price-range-header">
          <span style={{ fontWeight: 'bold' }}>Price Range</span>
          <ReloadOutlined
            className="icon-refresh"
            onClick={() => {
              setPriceFilter(null)
            }}
            style={{ color: '#CDAA1F', cursor: 'pointer' }}
          />
        </div>

        <Form.Item labelCol={{ span: 24 }} className="price-select-vertical">
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
        </Form.Item> */}
      </Form>
    </Drawer>
  )
}

export default FilterDrawer
