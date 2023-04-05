import React, { useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import { FiSend } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { commentPost } from '../../../features/postsSlice'

const Comments = ({ setIsOpen, comments, _id }) => {
  // show the comment input and then the comments
  const dispatch = useDispatch()
  const { profilePicture } = useSelector(state => state.auth)
  const [comment, setComment] = useState('')

  const handleChange = ({ target }) => {
    setComment(target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(commentPost({ postId: _id, comment }))
    setComment('')
  }

  return (
    <div className='comments'>
      <div className="comments-close" onClick={() => setIsOpen(false)}>
        Close comments
      </div>
      <form className="comments-input-form" onSubmit={handleSubmit}>
        {profilePicture === '' ? (
          <CgProfile />
        ) : (
          <img src={profilePicture} alt="" />
        )}
        <div className="comments-form-control">
          <input type="text" onChange={handleChange} value={comment || ''} name="comment" placeholder='  Comment on this post' minLength={6} maxLength={100} />
          <button type='submit'>
            <FiSend />
          </button>
        </div>
      </form>
      <div className="comments-container">
        {comments.length > 0 && comments.map((c, index) => {
          return (
            <div className="comment-inner" key={index}>
              <div className="commenter-profile-picture">
                {c.creatorImage === '' ? (
                  <CgProfile />
                ) : (
                  <img src={c.creatorImage} alt="" />
                )}
              </div>
              <div className="commenter-comment">
                {c.comment}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Comments