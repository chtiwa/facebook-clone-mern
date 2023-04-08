import React, { useState, useEffect, useRef } from 'react'
import './create.css'
import { AiOutlineClose } from 'react-icons/ai'
import { MdAddCircle } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { createPost, closeCreate } from '../../features/postsSlice'
import { useDispatch, useSelector } from 'react-redux'

const Modal = () => {
  const { profilePicture, username } = useSelector(state => state.auth)
  const { isCreateOpen } = useSelector(state => state.posts)
  const dispatch = useDispatch()
  const [file, setFile] = useState('')
  const [fileData, setFileData] = useState('')
  const [files, setFiles] = useState('')
  const [filesData, setFilesData] = useState('')
  const [description, setDescription] = useState('')

  const inputRef = useRef()
  useEffect(() => {
    if (isCreateOpen) {
      inputRef.current.focus()
    }
  }, [isCreateOpen])

  const handleFileChange = ({ target }) => {
    // console.log(target.value)
    // console.log(target.files)
    setFile(target.value)
    // setFileData(target.files[0])
    setFilesData(target.files)
    console.log(filesData)
    // console.log(target.files)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData()
    for (const key of Object.keys(filesData)) {
      form.append('files', filesData[key])
      console.log(filesData[key])
    }
    // form.append('file', fileData)
    form.append('description', description)
    dispatch(createPost(form))
    // setIsOpen(false)
    setFile('')
    setFileData('')
    setDescription('')
    dispatch(closeCreate())
  }

  const handleChange = ({ target }) => {
    setDescription(target.value)
  }

  return (
    <div className={`${isCreateOpen ? "create-modal-container" : 'hide'}`}>
      <div className="create-modal-inner">
        <div className="create-modal-info">
          <div className="create-modal-info-title">
            Create a post
          </div>
          <div className="create-modal-info-close" onClick={() => dispatch(closeCreate())}>
            <AiOutlineClose className='create-modal-info-close-icon' />
          </div>
        </div>
        <hr className='create-modal-line-break' />
        <form onSubmit={handleSubmit} className="create-modal-form">
          <div className="create-modal-textarea-container">
            <div className="create-modal-textarea-container-img">
              {profilePicture === '' || profilePicture === null ? (
                <CgProfile />
              ) : (
                <img src={profilePicture} alt="" />
              )}
              {username}
            </div>
            <textarea name="description" placeholder={`What's up ${username} ?`} maxLength="1000" minLength="10" onChange={handleChange} value={description || ""} ref={inputRef} required />
          </div>
          <div className="create-modal-input-container">
            <label htmlFor="post-file" >
              <MdAddCircle className="create-modal-input-container-icon" />
              {filesData.length === 0 && (<>Select one or multiple files</>)}
              {filesData.length === 1 && (filesData[0].name)}
              {filesData.length > 1 && (filesData.length)}
            </label>
            <input type="file" multiple id="post-file" name="files" onChange={handleFileChange} value={file || ''} />
          </div>
          <button type="submit" className='create-modal-form-btn'>Publish</button>
        </form>
      </div>
    </div>
  )
}

export default Modal