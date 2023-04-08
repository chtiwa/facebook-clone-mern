import React, { useEffect } from 'react'
import './freind-request.css'
import { BsFillPersonCheckFill } from 'react-icons/bs'
import { useSelector, useDispatch } from 'react-redux'
import { acceptFreindRequest } from '../../features/usersSlice'

const FreindRequest = () => {
  const dispatch = useDispatch()
  const { freindRequestsReceived, freindRequestsReceivedLoading } = useSelector(state => state.users)

  const handleClick = (_id) => {
    // console.log('clicked')
    dispatch(acceptFreindRequest(_id))
  }

  if (!freindRequestsReceivedLoading && freindRequestsReceived.length === 0) {
    return (
      <div className="freind__request-container-inner">
        <h4>0 freind requests</h4>
      </div>
    )
  }

  return !freindRequestsReceivedLoading && freindRequestsReceived?.length > 0 && freindRequestsReceived.map((user) => {
    const { profilePicture, username, _id } = user
    return (
      <div className="freind__request-user" key={_id}>
        <div className="freind__request-user-info">
          <div className="freind__request-user-profile-pciture">
            {profilePicture === '' ? (
              // <div className="freind__request-user-profile-picture-empty">
              <img src="/no-profile-picture.png" alt="" />
              // </div>
            ) : (
              <img src={profilePicture} alt="" />
            )}
          </div>
          <div className="freind__request-user-username">
            {username}
          </div>
        </div>
        <button className="freind__request-user-features" onClick={() => handleClick(_id)}>
          <BsFillPersonCheckFill className="freind__request-user-features-icon" />
        </button>
      </div>
    )
  })
}

export default FreindRequest