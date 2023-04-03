import React, { useState, useEffect } from 'react'
import './nav-info.css'
import { CgProfile, CgLogOut } from 'react-icons/cg'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { BsMessenger, BsBellFill, BsFillPersonFill } from 'react-icons/bs'
import FreindRequest from '../freind-requests/FreindRequest'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/authSlice'
import { Link } from 'react-router-dom'

const NavInfo = () => {
  const dispatch = useDispatch()
  const { username, profilePicture } = useSelector(state => state.auth)
  const { freindRequestsReceivedIds } = useSelector(state => state.users)
  const [openMenu, setOpenMenu] = useState(false)
  const [openFreindRequest, setOpenFreindRequest] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth)
    })
    if (windowWidth > 650) {
      setOpenMenu(false)
    }
    return window.removeEventListener('resize', () => console.log('cleanup'))
  }, [setWindowWidth, windowWidth])

  return (
    <div className="nav__info" onMouseLeave={() => setOpenFreindRequest(false)}>
      <div className="nav__info-container">
        <div className="nav__info-item" onClick={() => setOpenFreindRequest(true)}>
          <BsFillPersonFill className="nav__info-item-icon" />
          {freindRequestsReceivedIds?.length > 0 && (
            <div className="nav__info_item-badge">
              {freindRequestsReceivedIds?.length}
            </div>
          )}
        </div>
        {openFreindRequest && (
          <div className="freind__request-container" >
            <FreindRequest />
          </div>
        )}
        <div className="nav__info-item">
          <BsBellFill className="nav__info-item-icon" />
        </div>
        <Link to="/messenger" className="nav__info-item" >
          <BsMessenger className="nav__info-item-icon" />
        </Link>
        <div className="nav__info-item" onClick={() => dispatch(logout())}>
          <CgLogOut className="nav__info-item-icon" />
        </div>
        <Link to="/user" state={{ creator: username }} >
          {profilePicture === "" || profilePicture === null ? (
            <div className="nav__info-item">
              <CgProfile className="nav__info-item-icon" />
            </div>
          ) : (
            <img src={profilePicture} className="nav__info-profile-picture" alt="" />
          )}
        </Link>
      </div>
      {openMenu ? (
        <AiOutlineClose className='nav__close-icon' onClick={() => setOpenMenu(false)} />
      ) : (
        <AiOutlineMenu className='nav__menu-icon' onClick={() => setOpenMenu(true)} />
      )}
      {openMenu ? (
        <div className={`${openMenu ? "show-nav__info-container" : "hide-nav__info-container"}`} onMouseLeave={() => setOpenMenu(false)} >
          <div className="nav__info-item" onClick={() => setOpenFreindRequest(true)} >
            <BsFillPersonFill className="nav__info-item-icon" />
            {freindRequestsReceivedIds?.length > 0 && (
              <div className="nav__info_item-badge">
                {freindRequestsReceivedIds?.length}
              </div>
            )}
          </div>
          {openFreindRequest && (
            <div className="freind__request-container" >
              <FreindRequest />
            </div>
          )}
          <div className="nav__info-item">
            <BsBellFill className="nav__info-item-icon" />
          </div>
          <Link to="/messenger" className="nav__info-item" >
            <BsMessenger className="nav__info-item-icon" />
          </Link>
          <Link to="/user" state={{ creator: username }}>
            {profilePicture === "" || profilePicture === null ? (
              <div className="nav__info-item">
                <CgProfile className="nav__info-item-icon" />
              </div>
            ) : (
              <img src={profilePicture} className="nav__info-profile-picture" alt="" />
            )}
          </Link>
          <div className="nav__info-item" onClick={() => dispatch(logout())}>
            <CgLogOut className="nav__info-item-icon" />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default NavInfo