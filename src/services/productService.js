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
  console.log(query)
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
export { handleSortProductWithPaginate, handleSearchProductWithPaginate }
