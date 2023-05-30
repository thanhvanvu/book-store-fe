import axios from '../utils/axios-customize'

const handleRegister = (input) => {
  const options = {
    method: 'post',
    url: '/api/v1/user/register',
    data: input,
  }

  return axios(options)
}

const handleLogin = (input) => {
  const options = {
    method: 'post',
    url: '/api/v1/auth/login',
    data: input,
  }

  return axios(options)
}

const handleFetchAccount = () => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'get',
    url: '/api/v1/auth/account',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}

const handleLogout = () => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'post',
    url: '/api/v1/auth/logout',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}

const handleGetAllUsers = () => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'get',
    url: '/api/v1/user',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}

const handleGetUserWithPaginate = (pagination) => {
  const token = localStorage.getItem('access_token')
  const options = {
    method: 'get',
    url: `/api/v1/user?current=${pagination.current}&pageSize=${pagination.pageSize}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios(options)
}
export {
  handleRegister,
  handleLogin,
  handleFetchAccount,
  handleLogout,
  handleGetAllUsers,
  handleGetUserWithPaginate,
}
