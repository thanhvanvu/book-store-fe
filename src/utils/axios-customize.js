import axios from 'axios'

// soruce: https://vitejs.dev/guide/env-and-mode.html
const backendURL = import.meta.env.VITE_BACKEND_URL

const instance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
})

// every request from client, client will send the access token to server
const access_token = localStorage.getItem('access_token')
instance.defaults.headers.common = { Authorization: `Bearer ${access_token}` }

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

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error?.response?.data ?? Promise.reject(error)
  }
)

export default instance