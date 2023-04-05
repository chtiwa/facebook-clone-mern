import React from 'react'
import './left-nav.css'
import { CgProfile } from 'react-icons/cg'

const leftNav = () => {
  return (
    <ul className="left__nav-list" >
      <li className='left__nav-list-item'>
        <CgProfile className="left__nav-item-icon" />
      </li>
    </ul>
  )
}

export default leftNav