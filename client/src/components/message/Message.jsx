import React, { useState, useEffect } from 'react'
import './message.css'
import moment from 'moment'
import { useSelector } from 'react-redux'

const Message = ({ sender, text, createdAt, own, freinds }) => {
  const { profilePicture } = useSelector(state => state.auth)
  const [user, setUser] = useState('')
  useEffect(() => {
    if (own) return
    const senderInfo = freinds.find((f) => f._id === sender)
    setUser(senderInfo)
  }, [own, sender, freinds])

  return (
    <div className={`message ${own ? "own" : ""}`}>
      <div className="messageTop">
        {own === true ? (
          <img className='messageImg' src={profilePicture} alt="" />
        ) : (
          <img className='messageImg' src={user.profilePicture} alt="" />
        )}
        <p className="messageText">{text}</p>
      </div>
      <div className="messageBottom">
        {moment(createdAt).fromNow()}
      </div>

    </div>
  )
}

export default Message