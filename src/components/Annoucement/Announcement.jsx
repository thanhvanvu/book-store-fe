import { Modal } from 'antd'
import { useDispatch } from 'react-redux'
import { doCloseAnnoucement } from '../../redux/announcement/announcementSlice'

const Announcement = (props) => {
  const { isOpenAnnouncement, setIsOpenAnnouncement } = props
  const dispatch = useDispatch()
  return (
    <Modal
      title="Announcement"
      open={isOpenAnnouncement}
      onOk={(event) => {
        event.preventDefault()
        setIsOpenAnnouncement(false)
        dispatch(doCloseAnnoucement())
      }}
      onCancel={(event) => {
        event.preventDefault()
        setIsOpenAnnouncement(false)
        dispatch(doCloseAnnoucement())
      }}
    >
      <p>
        My app is being woken up in 30 seconds because the server might be
        hibernated. Thank you for waiting patiently!
      </p>
      <br />
      <p>
        The modal will be closed automatically after the server is woken up!
      </p>
    </Modal>
  )
}

export default Announcement
