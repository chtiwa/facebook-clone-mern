import React from 'react'
import './create.css'
import { useDispatch, useSelector } from 'react-redux'
import { openCreate } from '../../features/postsSlice'
import Loader from '../loader/Loader'
const Create = () => {
  const dispatch = useDispatch()
  const { profilePicture, username } = useSelector(state => state.auth)
  const { isCreateOpen, createPostLoading } = useSelector(state => state.posts)

  return (
    <>
      {!isCreateOpen && (
        <div className='create'>
          <div className="create-container">
            {createPostLoading ? (<Loader />) : (
              <>
                <div className="create-profile-picture">
                  {profilePicture === '' || profilePicture === null ? (
                    <img src="/no-profile-picture.png" alt="" />
                  ) : (
                    <img src={profilePicture} alt="" />
                  )}
                </div>
                <input type="text" className='create-input' placeholder={`  What's up ${username} ?`} onClick={() => dispatch(openCreate())} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Create