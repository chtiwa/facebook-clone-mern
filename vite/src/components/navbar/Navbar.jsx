import React, { useEffect } from 'react'
import './navbar.css'
import Search from '../search/Search'
import NavInfo from '../nav-info/NavInfo'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getFreinds, getFreindRequestsSent, getFreindRequestsReceived } from '../../features/usersSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  // const { freindsIds } = useState(state => state.users)
  useEffect(() => {
    dispatch(getFreinds())
    dispatch(getFreindRequestsSent())
    dispatch(getFreindRequestsReceived())
  }, [dispatch])

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