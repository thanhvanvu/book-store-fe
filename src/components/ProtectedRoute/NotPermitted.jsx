import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
const NotPermitted = () => {
  const navigate = useNavigate()
  const backHomeButton = () => {
    navigate('/')
  }
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={backHomeButton}>
          Back Home
        </Button>
      }
    />
  )
}

export default NotPermitted
