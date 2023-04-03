import React, { useEffect } from 'react'
import './modal.css'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal, } from '../../features/modalSlice'

const Modal = () => {
  const dispatch = useDispatch()
  const { isOpen, message, success } = useSelector(state => state.modal)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(closeModal())
    }, [3000])
    return () => clearTimeout(timer)
  }, [isOpen, dispatch])

  return (
    <div className={`${isOpen ? "reset__password-modal-show" : "reset__password-modal-hide"} ${success ? "success-true" : "success-false"} `} >
      {message}
    </div>
  )
}

export default Modal