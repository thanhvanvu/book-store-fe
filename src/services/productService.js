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
export {
  handleSortProductWithPaginate,
  handleSearchProductWithPaginate,
  handleFetchCategory,
}
