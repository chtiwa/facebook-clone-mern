import React, { useState } from 'react'
import './post.css'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector, useDispatch } from 'react-redux'
import { closePostModal } from '../../../features/postsSlice'

const PostModal = () => {
  const dispatch = useDispatch()
  const { files } = useSelector(state => state.posts)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleArrowClick = (param) => {
    if (param === "b") {
      setCurrentIndex(currentIndex => currentIndex - 1)
    } else {
      setCurrentIndex(currentIndex => currentIndex + 1)
    }
  }

  // handle the file display
  // check if the file is a video or an image
  return (
    <div className="story-carousel">
      <div className="story-carousel-inner">
        <div className="stories-carousel-inner-close" onClick={() => dispatch(closePostModal())}>
          <AiOutlineClose />
        </div>
        {currentIndex < files.length - 1 && (
          <div className="stories-carousel-inner-arrow-forward" onClick={() => handleArrowClick("f")} >
            <IoIosArrowForward className='stories-carousel-inner-arrow-icon' />
          </div>
        )}
        {currentIndex > 0 && (
          <div className="stories-carousel-inner-arrow-back" onClick={() => handleArrowClick("b")} >
            <IoIosArrowBack className='stories-carousel-inner-arrow-icon' />
          </div>
        )}
        <div className="slide-container">
          <ul className="slide-container-inner">
            {files?.length > 0 && files.map((file, index) => {
              const { url, format, _id } = file
              return (format === "jpeg" || format === "jpg" || format === "png" || format === "webp" || format === "gif") ? (
                <div key={_id} >
                  <li className={`slide ${currentIndex === index && "slide-show"}`} >
                    <img src={url} alt="" />
                  </li>
                </div>
              ) : (
                <div key={_id} >
                  <li className={`slide ${currentIndex === index && "slide-show"}`} >
                    <video controls autoPlay muted playsInline>
                      <source src={url} type={`video / ${format}`} />
                    </video>
                  </li>
                </div>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PostModal