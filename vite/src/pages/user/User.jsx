import React, { useState, useEffect } from 'react'
import './user.css'
import Posts from '../../components/posts/Posts'
import { MdAddCircle } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { changeCoverPicture, changeProfilePicture, getUser } from '../../features/usersSlice'
import { getUserPosts } from '../../features/postsSlice'
import { useLocation } from 'react-router-dom'
import Loader from '../../components/loader/Loader'

const User = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  // user info
  const { username } = useSelector(state => state.auth)
  const { profilePicture, coverPicture, loading, name, freinds } = useSelector(state => state.users)
  const [file, setFile] = useState('')
  const [fileData, setFileData] = useState('')
  const [isCoverPicture, setIsCoverPicture] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    dispatch(getUser({ username: location?.state?.creator }))
  }, [dispatch, location?.state?.creator])
  useEffect(() => {
    dispatch(getUserPosts({ creator: location?.state?.creator }))
  }, [dispatch, location?.state?.creator])

  // user posts 
  // const { userPage, pages,  } = useSelector(state => state.posts)
  // const [scrollPosition, setScrollPosition] = useState(0)


  // const handleScroll = useCallback(() => {
  //   setScrollPosition(window.pageYOffset)
  //   if (scrollPosition >= lastPostY && pages > userPage) {
  //     dispatch(setUserPage(userPage + 1))
  //   }
  // }, [dispatch, lastPostY, userPage, pages, scrollPosition])

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll)
  //   return () => window.removeEventListener('scroll', handleScroll)
  // }, [handleScroll])


  const handleFileChange = ({ target }) => {
    setFile(target.value)
    setFileData(target.files[0])
    setIsOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('file', fileData)
    if (isCoverPicture) {
      dispatch(changeCoverPicture(form))
    } else {
      dispatch(changeProfilePicture(form))
    }
    setFile('')
    setFileData('')
    setIsOpen(false)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className='user'>
        <div className="user-cover-container">
          {coverPicture === '' ? (
            <div className="user-coverpic-empty">
              <p>No cover picture</p>
            </div>
          ) : (
            <img src={coverPicture} alt="" className='user-coverpic' />
          )}
          {profilePicture === '' ? (
            <div className='user-profilepic-empty' >
              No profile picture
            </div>
          ) : (
            <img src={profilePicture} alt="" className='user-profilepic' />
          )}
          <h3 className="user-cover-name">
            {name}
          </h3>
          {name === username ? (
            <form onSubmit={handleSubmit} className="user-change-file">
              {isOpen && (<button type="submit">Submit</button>)}
              <div className="user-form-control">
                <MdAddCircle className="stories-inner-container-icon" />
                <label htmlFor="file" className="user-form-control-content">
                  <h3 onClick={() => setIsCoverPicture(false)} >Change profile picutre</h3>
                  <h3 onClick={() => setIsCoverPicture(true)} >Change cover picutre</h3>
                </label>
              </div>
              <input type="file" id='file' name="file" onChange={handleFileChange} value={file || ''} />
              {file}
            </form>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="user-extra-container">
        {username === name ? (
          <div className="user-freinds-container">
            <div className="user-freinds-container-inner">
              <div className="user-freinds-container-inner-info">
                <div className="user-freinds-container-inner-info-title">
                  Freinds
                </div>
                <div className="user-freinds-container-inner-info-count">
                  {freinds.length} freinds
                </div>
              </div>
              <div className="user-freinds-container-inner-freinds">
                {freinds.length > 0 && freinds.map((f) => {
                  const { _id, username, profilePicture } = f
                  return (
                    <div className="user-freinds-container-inner-freinds-freind" key={_id}>
                      <div className="user-freinds-container-inner-freinds-freind-img">
                        {profilePicture === '' ? (
                          <div className="user-freinds-container-inner-freinds-freind-img-empty"></div>
                        ) : (
                          <img src={profilePicture} alt="" />
                        )}
                      </div>
                      <div className="user-freinds-container-inner-freinds-freind-name">
                        {username}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="user-posts">
          <Posts />
        </div>
      </div>
    </>
  )
}

export default User