import React, { useState, useEffect } from 'react'
import './post.css'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'
import { VscComment } from 'react-icons/vsc'
import { CgProfile, CgMoreAlt } from 'react-icons/cg'
import Comments from './Comments'
import { unlikePost, likePost, deletePost, openPostModal } from '../../../features/postsSlice'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Post = ({ creator, creatorImage, description, files, likes, comments, createdAt, _id, index, length }) => {
  const { userId, username } = useSelector(state => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [hasLikedPost, setHasLikedPost] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const index = likes.findIndex((id) => id === userId)
    if (index === -1) {
      setHasLikedPost(false)
    } else {
      setHasLikedPost(true)
    }
  }, [likes, userId])

  const handleLike = () => {
    if (hasLikedPost) {
      dispatch(unlikePost(_id))
    } else {
      dispatch(likePost(_id))
    }
    setHasLikedPost(hasLikedPost => !hasLikedPost)
  }

  // show only the first file in Post 
  let fileDisplay
  if (files[0]?.format === "jpeg" || files[0]?.format === "jpg" || files[0]?.format === "png" || files[0]?.format === "webp" || files[0]?.format === "gif") {
    fileDisplay = <img src={files[0]?.url} alt="img" />
  } else if (files[0]?.format === "mp4" || files[0]?.format === "mov" || files[0]?.format === "wmv" || files[0]?.format === "avi" || files[0]?.format === "webm") {
    fileDisplay = <video controls autoPlay muted playsInline>
      <source src={files[0]?.url} type={`video/${files[0]?.format}`} />
    </video>
  } else {
    fileDisplay = <></>
  }

  const date = moment(createdAt).fromNow()

  return (
    <div className='post'>
      <div className="post-info">
        <div className="post-info-container">
          <Link className="post-info-creator-img" to={`/user`} state={{ creator: creator }} >
            {creatorImage === '' ? (
              <CgProfile />
            ) : (
              <img src={creatorImage} alt="" />
            )}
          </Link>
          <div className="post-info-extra">
            <div className="post-info-extra-creator">
              {creator}
            </div>
            <div className="post-info-extra-created-at">
              {date}
            </div>
          </div>
        </div>
        {username === creator && (
          <div className="post-info-container-2">
            <CgMoreAlt className="post-info-container-icon" />
            <div className="post-info-container-content" onClick={() => dispatch(deletePost(_id))} >
              Delete
            </div>
          </div>
        )}
      </div>
      <div className="post-description">
        &nbsp; &nbsp; {description}
      </div>
      <div className="post-file">
        {files.length > 1 && (
          <div className="post-file-extra" onClick={() => dispatch(openPostModal(files))}>
            + {files.length - 1}
          </div>
        )}
        {fileDisplay}
      </div>
      <div className="post-extra-info">
        <div className="post-extra-info-likes">
          <div className="post-extra-info-likes-container">
            <AiFillLike className='post-extra-info-likes-container-icon' />
          </div>
          <div className="post-extra-info-likes-container">
            <FcLike className='post-extra-info-likes-container-icon' />
          </div>
          <div className="post-extra-info-p">
            {/* 1.3k  */}
            {likes?.length} &nbsp; likes
          </div>
        </div>
        <div className="post-extra-info-comments">
          {comments?.length} &nbsp; comments
          {/* 53 */}
        </div>
      </div>
      <hr className='post-linebreak' />
      <div className="post-features">
        <div className="post-features-inner-container" onClick={handleLike}>
          <div className="post-features-like-icon-container">
            {hasLikedPost ? (
              <AiFillLike className='post-features-like-icon --accent' />
            ) : (
              <AiOutlineLike className="post-features-like-icon" />
            )}
          </div>
          <div className="post-features-like-p">
            {!hasLikedPost ? "Like" : "Unlike"}
          </div>
        </div>
        <div className="post-features-inner-container" onClick={() => setIsOpen(true)}>
          <div className="post-features-like-icon-container">
            <VscComment className="post-features-comment-icon" />
          </div>
          <div className="post-features-comment-p"  >
            Comment
          </div>
        </div>
      </div>
      <div className="post-commets">
        {isOpen && <Comments setIsOpen={setIsOpen} comments={comments} _id={_id} />}
      </div>
    </div>
  )
}

export default Post