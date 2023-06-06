import { Badge, Descriptions, Drawer } from 'antd'
import moment from 'moment/moment'

const UserViewDetail = (props) => {
  let openDrawer = props.openDrawer
  let viewDetailUser = props.viewDetailUser

  const handleOnClose = () => {
    props.onClose() // Call the onClose function from props
  }
  return (
    <Drawer
      title="View user detail information"
      placement="right"
      onClose={handleOnClose}
      open={openDrawer}
      width="50vw"
    >
      <Descriptions title="User Infomation" bordered column={2}>
        <Descriptions.Item label="Id">
          {viewDetailUser?._id ? viewDetailUser._id : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Full name">
          {viewDetailUser?.fullName ? viewDetailUser.fullName : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {viewDetailUser?.email ? viewDetailUser.email : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Phone number" span={2}>
          {viewDetailUser?.phone ? viewDetailUser.phone : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Role" span={3}>
          <Badge
            status="processing"
            text={viewDetailUser?.role ? viewDetailUser.role : ''}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {viewDetailUser?.createdAt
            ? moment(viewDetailUser.createdAt).format('MM/DD/YYYY')
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {viewDetailUser?.updatedAt
            ? moment(viewDetailUser.updatedAt).format('MM/DD/YYYY')
            : ''}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  )
}

export default UserViewDetail
