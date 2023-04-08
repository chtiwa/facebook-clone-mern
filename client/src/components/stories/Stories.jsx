import React, { useEffect, useState } from 'react'
import './stories.css'
import { MdAddCircle } from 'react-icons/md'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { createStory, getStories, openCarousel } from '../../features/storiesSlice'
import Loader from '../loader/Loader'

const Stories = () => {
  const dispatch = useDispatch()
  const { stories, createStoryloading } = useSelector(state => state.stories)
  const [index, setIndex] = useState(0)
  // const [showStory, setShowStory] = useState(false)
  const [file, setFile] = useState('')
  const [fileData, setFileData] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    dispatch(getStories())
  }, [dispatch])

  const handleChange = ({ target }) => {
    setFile(target.value)
    setFileData(target.files[0])
    setIsOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('file', fileData)
    dispatch(createStory(form))
    setFile('')
    setFileData('')
    setIsOpen(false)
  }

  const handleArrowClick = (param) => {
    if (param === "b") {
      setIndex(prev => prev - 1)
    } else {
      setIndex(prev => prev + 1)
    }
  }

  // overflow and translateX
  return (
    <div className="stories">
      {stories.length !== 0 && (
        <div className="stories-inner">
          {!createStoryloading && index < stories.length - 3 && (
            <div className="stories-inner-arrow-forward" onClick={() => handleArrowClick("f")} >
              <IoIosArrowForward className='stories-inner-arrow-forward-icon' />
            </div>
          )}
          {!createStoryloading && index > 0 && (
            <div className="stories-inner-arrow-back" onClick={() => handleArrowClick("b")} >
              <IoIosArrowBack className='stories-inner-arrow-back-icon' />
            </div>
          )}
          {createStoryloading && (<Loader />)}
          {!createStoryloading && stories?.length > 0 && stories.map((story) => {
            const { profilePicture, file, creator, _id } = story
            return (
              <div className="stories-inner-container" onClick={() => dispatch(openCarousel())} style={{ transform: `translateX(-${index * 126}px)` }} key={_id}>
                <img src={file.url} alt="" className='stories-inner-container-img' />
                <div className="stories-inner-container-userimg">
                  <img src={profilePicture} alt="" className='stories-inner-container-userimg-file' />
                </div>
              </div>
            )
          })}
        </div>
      )}
      <div className="stories-inner-features">
        <form onSubmit={handleSubmit} className="stories-inner-container" >
          <label htmlFor="story-file">
            <MdAddCircle className="stories-inner-container-icon" />
            {file === '' ? (<>Create a story</>) : (fileData?.name)}
          </label>
          <input type="file" id='story-file' name="file" onChange={handleChange} />
          {isOpen && (
            <button type='submit' className='stories-inner-container-button' >Publish Story</button>
          )
          }
        </form>
        {stories.length !== 0 && (
          <div className="stories-inner-container-view-stories" onClick={() => dispatch(openCarousel())}>
            View Stroies
          </div>
        )}
      </div>
    </div>
  )
}

export default Stories