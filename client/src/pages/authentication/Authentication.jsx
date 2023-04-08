import React, { useState } from 'react'
import './auth.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { login, signup, forgotPassword } from '../../features/authSlice'
import { openModal } from '../../features/modalSlice'
import { useDispatch, useSelector } from 'react-redux'

const Authentication = () => {
  const dispatch = useDispatch()
  const { emailError, emailLoading } = useSelector(state => state.auth)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [isLogin, setIsLogin] = useState(true)
  const [isPassword, setIsPassword] = useState(true)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleChange = ({ target }) => {
    const { name, value } = target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      dispatch(login(form))
    } else {
      dispatch(signup(form))
    }
  }

  const handleForgotPassword = () => {
    if (isEmailSent) return
    if (form.email.trim().length < 6) {
      dispatch(openModal({ message: 'Not a valid email!', success: false }))
      return
    }
    dispatch(forgotPassword(form))
    if (!emailLoading && !emailError) {
      setIsEmailSent(true)
    }
  }

  return (
    <div className="auth">
      <div className="auth-title">
        <h2>facebook</h2>
        <p>With facebook, share and stay in touch with freinds.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-control">
          <h2>{isLogin ? "Login" : "Sign up"}</h2>
        </div>
        {!isLogin && (
          <div className="auth-form-control">
            <input onChange={handleChange} type="text" name="username" value={form.username || ""} placeholder="username" required minLength={6} maxLength={20} />
          </div>
        )}
        <div className="auth-form-control">
          <input onChange={handleChange} type="email" name="email" value={form.email || ""} placeholder="johnwick@gmail.com" minLength={6} maxLength={60} required />
        </div>
        <div className="auth-form-control auth-form-control-password">
          <input onChange={handleChange} type={`${isPassword ? "password" : "text"}`} name="password" value={form.password || ""} placeholder="johnwick" className='auth-password-input' minLength={6} maxLength={20} required />
          {isPassword && form.password.length > 0 && (
            <AiOutlineEye className="auth-password-icon" onClick={() => setIsPassword(!isPassword)} />
          )}
          {!isPassword && form.password.length > 0 && (
            <AiOutlineEyeInvisible className="auth-password-icon" onClick={() => setIsPassword(!isPassword)} />
          )}
        </div>
        <div className="auth-form-control">
          <button type='submit' className="auth-form-control-submit">
            {isLogin ? "Login" : "Sign up"}
          </button>
        </div>
        {isLogin && (
          <div className="auth-form-control">
            <p onClick={handleForgotPassword} className='auth-form-control-forgot'>Forgot password?</p>
          </div>
        )}
        <div className="auth-form-control">
          <hr className='auth-form-hr' />
        </div>
        <div className="auth-form-control">
          {/* when the user demanded a password reset then disbale this button */}
          <button disabled={isEmailSent ? true : false} onClick={() => setIsLogin(isLogin => !isLogin)} className="auth-form-control-create">
            {!isLogin ? "Login" : "Create new account"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Authentication