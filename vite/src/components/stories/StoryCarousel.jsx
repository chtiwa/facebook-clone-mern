import React, { useState } from 'react'
import './storyCarousel.css'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { AiOutlineClose } from 'react-icons/ai'
import { closeCarousel } from '../../features/storiesSlice'
import { useDispatch } from 'react-redux'
import moment from 'moment'

const StoryCarousel = ({ stories }) => {
  const dispatch = useDispatch()
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleArrowClick = (param) => {
    if (param === "b") {
      setCurrentIndex(currentIndex => currentIndex - 1)
    }
    else {
      setCurrentIndex(currentIndex => currentIndex + 1)
    }
  }
  return (
    <div className="story-carousel">
      <div className="story-carousel-inner">
        <div className="stories-carousel-inner-close" onClick={() => dispatch(closeCarousel())}>
          <AiOutlineClose />
        </div>
        {currentIndex < stories.length - 1 && (
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
            {stories?.length > 0 && stories.map((story, index) => {
              const { file, profilePicture, _id, creator, createdAt } = story
              return (
                <div key={_id} >
                  <li className={`slide ${currentIndex === index && "slide-show"}`} >
                    <img src={file.url} alt="" />
                  </li>
                  <div className={`story-carousel-info ${currentIndex === index && "story-carousel-info-show"}`}>
                    <img src={profilePicture} alt="" />
                    <div className="story-carousel-info-extra">
                      <p>{creator}</p>
                      <p>{moment(createdAt).fromNow()} </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StoryCarousel