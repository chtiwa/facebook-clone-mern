import React, { useEffect, useState, useRef } from 'react'
import './messenger.css'
import { useSelector, useDispatch } from 'react-redux'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { getConversations } from '../../features/conversationsSlice'
import { getMessages, createMessage, setMessages } from '../../features/messagesSlice'
// emit is to send an event to the server
// on is to receive an event from the server
import { io } from 'socket.io-client'

const Messegner = () => {
  const dispatch = useDispatch()
  const scrollRef = useRef()
  const { freinds } = useSelector(state => state.users)
  const { userId } = useSelector(state => state.auth)
  const { conversations, loading } = useSelector(state => state.conversations)
  const { messages } = useSelector(state => state.messages)
  const [currentChat, setCurrentChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socket = useRef()

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_APP_WS)
    // socket.current = io("ws://facebook-clone-chtiwa.herokuapp.com")
    socket.current.on("getMessage", (data) => {
      // console.log(data)
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      })
    })
  }, [])

  useEffect(() => {
    // console.log(currentChat?.members.includes(arrivalMessage?.sender))
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      dispatch(setMessages(arrivalMessage))
    }
  }, [arrivalMessage, currentChat?.members, dispatch])

  useEffect(() => {
    socket.current.emit("addUser", userId)
    socket.current.on("getUsers", users => {
      setOnlineUsers(users.map(user => user.userId))
    })
  }, [userId])

  useEffect(() => {
    dispatch(getConversations(userId))
  }, [dispatch, userId])

  useEffect(() => {
    dispatch(getMessages({ conversationId: currentChat?._id }))
  }, [dispatch, currentChat])

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = {
      sender: userId,
      text: newMessage,
      conversationId: currentChat._id
    }
    const receiverId = currentChat.members.find((memberId) => memberId !== userId)
    // socket is the the ref for the actual socket
    socket.current.emit("sendMessage", {
      senderId: userId,
      receiverId: receiverId,
      text: newMessage
    })
    dispatch(createMessage(message))
    setNewMessage('')
  }

  const handleMessageChange = ({ target }) => {
    setNewMessage(target.value)
  }

  // const handleConversation = () => {
  //   console.log(conversations)
  // }

  return (
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <span className='chatMenuText' >Conversations :</span>
          {!loading && conversations.map((c, index) => {
            return (
              <div onClick={() => setCurrentChat(c)} key={index} >
                <Conversation {...c} freinds={freinds} />
              </div>
            )
          })}
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop">
                {messages?.map((message, index) => {
                  return (
                    <div ref={scrollRef} key={index} >
                      <Message own={message.sender === userId ? true : false}  {...message} freinds={freinds} />
                    </div>
                  )
                })}
              </div>
              <form className="chatBoxBottom" onSubmit={handleSubmit}>
                <input className='chatMessageInput' placeholder='Write something' value={newMessage || ""} onChange={handleMessageChange} maxLength={80} minLength={1} />
                <button className="chatSubmitButton" type='submit'>
                  Send
                </button>
              </form>
            </>
          ) : (
            <span className="nullConversationText" >Open a conversation to start a chat.</span>
          )}
        </div>
      </div>
      <div className="chatOnline">
        <div className="chatOnlineWrapper">
          {freinds.map((f, index) => {
            return (
              <ChatOnline {...f} key={index} onlineUsers={onlineUsers} conversations={conversations} userId={userId} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Messegner