import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BsPersonPlusFill, BsFillPersonDashFill, BsFillPersonCheckFill } from 'react-icons/bs'
import './search.css'

const UserComponent = ({ username, profilePicture, _id, removeFreind, sendFreindRequest, freindsIds, freindRequestsSentIds, userId }) => {
  const [isFreinds, setIsFreinds] = useState(false)
  const [isPendingFreinds, setIsPendingFreinds] = useState(false)
  const dispatch = useDispatch()

  // check if they are freinds / not freinds / pending freinds
  useEffect(() => {
    if (freindsIds?.length !== 0) {
      setIsFreinds(freindsIds?.includes(_id))
    }
    if (freindRequestsSentIds?.length !== 0) {
      setIsPendingFreinds(freindRequestsSentIds.includes(_id))
    }
  }, [freindsIds, freindRequestsSentIds, _id])

  const handleClick = () => {
    if ((isFreinds && !isPendingFreinds) || (!isFreinds && isPendingFreinds)) {
      dispatch(removeFreind({ userId: _id }))
    } else {
      dispatch(sendFreindRequest({ userId: _id }))
    }
  }
  return userId !== _id ? (
    <div className="search__content-user">
      <div className="search__content-user-info">
        <div className="search__content-user-profile-pciture">
          {profilePicture === '' ? (
            <div className="search__content-user-profile-picture-empty">
              <img src="/no-profile-picture.png" alt="" />
            </div>
          ) : (
            <img src={profilePicture} alt="" />
          )}
        </div>
        <div className="search__content-user-username">
          {username}
        </div>
      </div>
      <button className="search__content-user-features" onClick={handleClick}>
        {/* they are freinds */}
        {isFreinds && !isPendingFreinds && (
          <BsFillPersonDashFill className="search__content-user-features-icon" />
        )}
        {/* they are pending freinds */}
        {!isFreinds && isPendingFreinds && (
          <BsFillPersonCheckFill className="search__content-user-features-icon" />
        )}
        {/* they aren't freinds */}
        {!isFreinds && !isPendingFreinds && (
          <BsPersonPlusFill className="search__content-user-features-icon" />
        )}
      </button>
    </div>
  ) : (
    <></>
  )
}

export default UserComponent