import React, { useEffect } from 'react'
import './right-nav.css'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RightNav = () => {
  const navigate = useNavigate()
  const { freinds, loading } = useSelector(state => state.users)

  useEffect(() => {
    console.log(freinds)
  }, [freinds])

  return (
    <div className="right__nav">
      <div className="right__nav-search">
        <div className="right__nav-freinds-search">
          <h4>Freinds</h4>
        </div>
      </div>
      <hr className='right__nav-hr' />
      <div className="right__nav-freinds-container" >
        {/*  */}
        {!loading && freinds?.length > 0 && freinds?.map((follower, index) => {
          const { username, profilePicture } = follower
          return (
            <div className="right__nav-freinds-container-freind" key={index} onClick={() => navigate(`/messenger`)}>
              <div className="right__nav-freinds-container-freind-picture">
                {profilePicture !== '' ? (
                  <img src={profilePicture} alt="" />
                ) : (
                  <img src="/no-profile-picutre.png" alt="" />
                )}
              </div>
              <div className="right__nav-freinds-container-freind-name">
                {username}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RightNav