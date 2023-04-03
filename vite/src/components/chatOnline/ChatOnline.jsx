import React, { useState, useEffect } from 'react'
import './chatOnline.css'
import { useDispatch } from 'react-redux'
import { createConversation } from '../../features/conversationsSlice'

const ChatOnline = ({ profilePicture, username, _id, onlineUsers, conversations, userId }) => {
  const dispatch = useDispatch()
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    // onlineUsers is the online users userId
    // console.log(onlineUsers)
    setIsOnline(onlineUsers.includes(_id))
  }, [_id, onlineUsers])

  const handleAddConversation = () => {
    // get the members ids apart from the current user id 
    const members = conversations.map(c => c.members)
    let currentMembers = []
    members.forEach((membersIds => {
      membersIds.forEach((memberId) => memberId !== userId && currentMembers.push(memberId))
    }))
    // check if the current members includes this particular user._id
    const validConvo = currentMembers.includes(_id)
    console.log(validConvo)
    // if there is no convo ==> add a new one
    // else return
    if (validConvo) return
    dispatch(createConversation({ senderId: userId, receiverId: _id }))
  }

  return isOnline && (
    <div className='chatOnline' onClick={handleAddConversation}>
      <div className="chatOnlineFreinds">
        <div className="chatOnlineImgContainer">
          <img className='chatOnlineImg' src={profilePicture} alt="" />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">{username}</span>
      </div>
    </div>
  )
}

export default ChatOnline