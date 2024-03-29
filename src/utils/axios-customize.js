import axios from 'axios'
import { Mutex, Semaphore, withTimeout } from 'async-mutex'
import { useSelector } from 'react-redux'
const mutex = new Mutex()
// soruce: https://vitejs.dev/guide/env-and-mode.html
const backendURL = import.meta.env.VITE_BACKEND_URL

const instance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
})

// every request from client, client will send the access token to server
const access_token = localStorage.getItem('access_token')
instance.defaults.headers.common = { Authorization: `Bearer ${access_token}` }

// update token
const handleRefreshToken = async () => {
  // mutex will make sure the refresh api will be called 1 at a time
  return await mutex.runExclusive(async () => {
    const response = await instance.get('/api/v1/auth/refresh')
    if (response?.data) {
      return response.data.access_token
    } else {
      return null
    }
  })
}

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

const NO_RETRY_HEADER = 'x-no-retry'

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken()
      error.config.headers[NO_RETRY_HEADER] = 'true'
      if (access_token) {
        error.config.headers['Authorization'] = `Bearer ${access_token}`

        localStorage.setItem('access_token', access_token)

        return instance.request(error.config)
      }
    }

    if (
      error.config &&
      error.response &&
      +error.response.status === 400 &&
      error.config.url === '/api/v1/auth/refresh'
    ) {
      const { isAuthenciated } = useSelector((state) => state.account)
      if (isAuthenciated === false) {
        // do nothing
      } else {
        window.location.href = '/login'
      }
    }

    return error?.response?.data ?? Promise.reject(error)
  }
)

export default instance
