import React, { useState } from 'react'
import '../authentication/auth.css'
import { useParams, useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { resetPassword } from '../../features/authSlice'
import { openModal } from '../../features/modalSlice'
import { useDispatch } from 'react-redux'


const ResetPassword = () => {
  const { resetToken } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [isPassword, setIsPassword] = useState(true)

  const handleChange = ({ target }) => {
    let { name, value } = target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      dispatch(openModal({ message: "Passwords don't match!", success: false }))
      return
    }
    dispatch(resetPassword({ resetToken, form, navigate }))
  }

  return (
    <div className='reset__password'>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-control" >
          <h2>Reset Password</h2>
        </div>
        <div className="auth-form-control auth-form-control-password">
          <input onChange={handleChange} type={`${isPassword ? "password" : "text"}`} name="password" value={form.password || ""} placeholder="password" className='auth-password-input' minLength={6} maxLength={20} />
          {isPassword && form.password.length > 0 && (
            <AiOutlineEye className="auth-password-icon" onClick={() => setIsPassword(!isPassword)} />
          )}
          {!isPassword && form.password.length > 0 && (
            <AiOutlineEyeInvisible className="auth-password-icon" onClick={() => setIsPassword(!isPassword)} />
          )}
        </div>
        <div className="auth-form-control">
          <input type="password" name="confirmPassword" value={form.confirmPassword || ''} placeholder="Confirm password" onChange={handleChange} minLength={6} maxLength={20} />
        </div>
        <div className="auth-form-control">
          <button type='submit' className="auth-form-control-submit">
            Reset password
          </button>
        </div>
      </form>
    </div>
  )
}

export default ResetPassword