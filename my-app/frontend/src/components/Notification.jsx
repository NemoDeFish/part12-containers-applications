import PropTypes from 'prop-types'

const Notification = ({ info }) => {
  if (!info.message) {
    return null
  }

  const style = {
    color: info.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div className="notif" style={style}>
      {info.message}
    </div>
  )
}

Notification.propTypes = {
  info: PropTypes.object.isRequired
}

export default Notification