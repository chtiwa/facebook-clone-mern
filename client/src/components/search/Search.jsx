import React, { useState, useEffect } from 'react'
import './search.css'
import { AiOutlineSearch, AiOutlineArrowLeft } from 'react-icons/ai'
import { useSelector, useDispatch } from 'react-redux'
import { sendFreindRequest, removeFreind, searchUsers } from '../../features/usersSlice'
import UserComponent from './UserComponent'

const Search = () => {
  // navbar
  const dispatch = useDispatch()
  // freind requests sent and received
  const { users, freinds, loading, freindsIds, freindRequestsSentIds
  } = useSelector(state => state.users)
  const { userId } = useSelector(state => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleChange = ({ target }) => {
    setSearch(target.value)
  }

  const handleSearch = () => {
    if (search.length === 0) return
    dispatch(searchUsers(search))
  }

  const handleMousLeave = () => {
    setSearch('')
    setIsOpen(false)
  }

  const handleMousEnter = () => {
    setSearch('')
    setIsOpen(true)
  }

  return (
    <div className="search__input-container" onMouseLeave={handleMousLeave} onMouseEnter={handleMousEnter}>
      {!isOpen ? (
        <AiOutlineSearch className="search__input-container-icon" />
      ) : (
        <AiOutlineArrowLeft className='search__input-container-icon' />
      )}
      <input type="text" name="search" value={search || ""} onChange={handleChange} onKeyUp={handleSearch} placeholder='Search users on facebook' autoComplete="off" />
      {isOpen && !loading && users.length > 0 && search.length > 0 && (
        <div className="search__content">
          {users.map((user, index) => {
            return (
              <UserComponent {...user} removeFreind={removeFreind} sendFreindRequest={sendFreindRequest} freindsIds={freindsIds} freindRequestsSentIds={freindRequestsSentIds} userId={userId} key={index} />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Search