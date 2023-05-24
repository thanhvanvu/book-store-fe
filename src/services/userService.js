import axios from '../utils/axios-customize'

const handleRegister = (input) => {
  // key email, password must be the same from backend side

  const options = {
    method: 'post',
    url: '/api/v1/user/register',
    data: input,
  }

  return axios(options)
}

const handleLogin = (input) => {
  // key email, password must be the same from backend side

  const options = {
    method: 'post',
    url: '/api/v1/auth/login',
    data: input,
  }

  return axios(options)
}
export { handleRegister, handleLogin }
