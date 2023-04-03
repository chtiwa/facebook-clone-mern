import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './conversation.css'

const Conversation = ({ members, freinds }) => {
  const { userId } = useSelector(state => state.auth)
  const { loading } = useSelector(state => state.users)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const freindId = members.find(memberId => memberId !== userId)
    const user = freinds.find((f) => f._id === freindId)
    setUser(user)
    console.log(user)
  }, [members, userId, freinds])

  return !loading && (
    <div className="conversation">
      <img src={user?.profilePicture} alt="" className="conversationImg" />
      <span className="conversationName">{user?.username}</span>
    </div>
  )
}

export default Conversation