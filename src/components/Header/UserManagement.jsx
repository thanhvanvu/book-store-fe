import { Modal, Tabs } from 'antd'
import React from 'react'
import UpdateUser from './UpdateUser'
import ChangePassword from './ChangePassword'
import { useSelector } from 'react-redux'

const UserManagement = (props) => {
  const isOpenUserManagement = props.isOpenUserManagement
  const openModalUserManagement = props.openModalUserManagement
  const items = [
    {
      key: '1',
      label: `Update Information`,
      children: <UpdateUser />,
    },
    {
      key: '2',
      label: `Change password`,
      children: (
        <ChangePassword openModalUserManagement={openModalUserManagement} />
      ),
    },
  ]

  return (
    <Modal
      title="User management"
      open={isOpenUserManagement}
      onCancel={openModalUserManagement}
      width="40vw"
      footer={false}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Modal>
  )
}

export default UserManagement
