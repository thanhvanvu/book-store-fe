import { Form } from 'antd'
import axios from '../utils/axios-customize'

const handleSortProductWithPaginate = (pagination, query) => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'get',
    url: `/api/v1/book?current=${pagination.current}&pageSize=${pagination.pageSize}&sort=${query}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}

const handleGetProductWithFilter = (
  pagination,
  category,
  sort,
  searchBook,
  priceFilter
) => {
  let searchBookQuery
  if (searchBook === '' || searchBook === undefined) {
    searchBookQuery = `mainText=`
  } else {
    searchBookQuery = `mainText=/${searchBook}/i`
  }

  let priceBookQuery
  if (priceFilter === '' || priceFilter === undefined || priceFilter === null) {
    priceBookQuery = ''
  } else if (priceFilter === 'infinity') {
    priceBookQuery = `&price>=30&price<=30`
  } else {
    let priceFrom = priceFilter
    let priceTo = priceFilter + 10
    priceBookQuery = `&price>=${priceFrom}&price<=${priceTo}`
  }

  const token = localStorage.getItem('access_token')
  const options = {
    method: 'get',
    url: `/api/v1/book?current=${pagination.current}&pageSize=${pagination.pageSize}&category=${category}&sort=${sort}&${searchBookQuery}${priceBookQuery}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}

const handleSearchProductWithPaginate = (pagination, keySearch) => {
  let query = `/api/v1/book?current=${pagination.current}&pageSize=${
    pagination.pageSize
  }
  }&mainText=${'/' + keySearch.mainText + '/i'}&author=${
    '/' + keySearch.author + '/i'
  }&category=${'/' + keySearch.category + '/i'}`
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'get',
    url: query,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}

const handleFetchCategory = () => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'get',
    url: `/api/v1/database/category`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}

const handleUploadImage = (fileImg) => {
  const bodyFormData = new FormData()
  bodyFormData.append('fileImg', fileImg)
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'post',
    url: `/api/v1/file/upload`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
      'upload-type': 'book',
    },
    data: bodyFormData,
  }

  return axios(options)
}

const handleCreateNewProduct = (productInput) => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'post',
    url: `/api/v1/book`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: productInput,
  }

  return axios(options)
}

const handleUpdateProduct = (productInput) => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'put',
    url: `/api/v1/book/${productInput._id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: productInput,
  }

  return axios(options)
}

const handleDeleteProduct = (productId) => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'delete',
    url: `/api/v1/book/${productId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}

const handleGetProductById = (productId) => {
  const options = {
    method: 'get',
    url: `/api/v1/book/${productId}`,
  }

  return axios(options)
}

const handleGetOrderHistory = () => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'get',
    url: `/api/v1/history`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}

export {
  handleSortProductWithPaginate,
  handleSearchProductWithPaginate,
  handleFetchCategory,
  handleUploadImage,
  handleCreateNewProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleGetProductWithFilter,
  handleGetProductById,
  handleGetOrderHistory,
}
