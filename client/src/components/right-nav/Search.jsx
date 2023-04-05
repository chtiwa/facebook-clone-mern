import React, { useState } from 'react'
import './right-nav.css'
import { AiOutlineArrowLeft } from 'react-icons/ai'

const Search = ({ setIsSearchOpen }) => {
  const [search, setSearch] = useState('')

  const handleChange = ({ target }) => {
    setSearch(target.value)
  }

  return (
    <div className="righ__nav-input-control">
      <AiOutlineArrowLeft onClick={() => setIsSearchOpen(false)} className='righ__nav-input-control-icon' />
      <input type="text" name="search" value={search || ''} onChange={handleChange} placeholder="Search" />
    </div>
  )
}

export default Search