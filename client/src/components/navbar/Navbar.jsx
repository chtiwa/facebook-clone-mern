import React, { useEffect } from 'react'
import './navbar.css'
import Search from '../search/Search'
import NavInfo from '../nav-info/NavInfo'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getFreinds, getFreindRequestsSent, getFreindRequestsReceived } from '../../features/usersSlice'

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggedIn, checkLoginLoading } = useSelector(state => state.auth)
  useEffect(() => {
    dispatch(getFreinds())
    dispatch(getFreindRequestsSent())
    dispatch(getFreindRequestsReceived())
  }, [dispatch])

  useEffect(() => {
    if (!checkLoginLoading && !isLoggedIn) navigate('/')
  }, [isLoggedIn])

  return (
    <div className="navbar">
      <Link to='/' className="navbar__logo" >
        <img src="facebook.png" alt="" />
      </Link>
      <div className="navbar__search">
        <Search />
      </div>
      <div className="navbar__info">
        <NavInfo />
      </div>
    </div >
  )
}

export default Navbar