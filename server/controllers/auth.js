require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
const asyncWrapper = require('../middleware/async-wrapper')
const BaseError = require('../errors/base-error')

const signup = asyncWrapper(async (req, res) => {
  const { password } = req.body
  const user = await User.create({ ...req.body })
  if (!user) {
    throw new BaseErro('There was an error', 400)
  }
  const access_token = user.createAccessToken()
  const refresh_token = user.createRefreshToken()

  // hash the user's password
  user.hashPassword()

  user.refresh_token = refresh_token
  // save the refresh_token and password
  user.save()

  res.status(201)
    .cookie("access_token", access_token, { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(Date.now() + 5 * 60 * 1000) }) // 5 minutes
    .cookie("refresh_token", refresh_token, { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }) // 10 days
    .json({ success: true, username: user.username, userId: user._id, profilePicture: user.profilePicture })
})

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: `Please provide an email and a password` })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: `Email doesn't exist!` })
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    return res.status(404).json({ message: `Something went wrong try again later!` })
  }

  const refresh_token = user.createRefreshToken()
  const access_token = user.createAccessToken()

  user.refresh_token = refresh_token
  user.save()

  res.status(200)
    .cookie("access_token", access_token, { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(Date.now() + 5 * 60 * 1000) }) // 5 minutes
    .cookie("refresh_token", refresh_token, { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }) // 10 days
    .json({ success: true, username: user.username, userId: user._id, profilePicture: user.profilePicture })
})

const logout = asyncWrapper(async (req, res) => {
  res.status(200)
    .cookie("refresh_token", "", { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(0) })
    .cookie("access_token", "", { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(0) })
    .json({ success: true, message: 'Log out successful' })
})

const checkLogin = asyncWrapper(async (req, res) => {
  const refresh_token = req.cookies.refresh_token
  if (!refresh_token) {
    throw new BaseError('Unauthorized', 401)
  }
  const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
  if (!payload) {
    throw new BaseError('Unauthorized', 401)
  }
  const user = await User.findById({ _id: payload.userId })

  if (!user) {
    throw new BaseError('Unauthorized', 401)
  }

  if (refresh_token !== user.refresh_token) {
    throw new BaseError('Unauthorized', 401)
  }

  const access_token = user.createAccessToken()
  // change the user's flag
  user.flag = "refresh_token"
  user.save()

  res
    .cookie("access_token", access_token, { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(Date.now() + 5 * 60 * 1000) }) // 5 minutes
    .status(200).json({ success: true, isLoggedIn: true, username: payload.username, userId: payload.userId, profilePicture: user?.profilePicture })
})

const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ success: false, message: `Email doesn't exist!` })
  }
  const pswjwt = user.resetPasswordJWT()
  const resultUrl = `${process.env.CLIENT_URL}/resetpassword/${pswjwt}`

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href="${resultUrl}" clicktracking="off">
    ${resultUrl}
    </a>`

  try {
    sendEmail({
      to: user.email,
      text: message,
      subject: 'Reset your password'
    })
    res.status(200).json({ success: true, message: `Email was sent successfuly` })
  } catch (error) {
    throw new BaseError(`Email couldn't be sent`, 400)
  }
})

const resetPassword = asyncWrapper(async (req, res, next) => {
  const pswjwt = req.params?.resetToken
  const payload = jwt.verify(pswjwt, process.env.JWT_SECRET)
  if (!payload) {
    // from the front end => error.response.data.message
    return res.status(400).json({ success: false, message: 'Token was expired' })
  }
  // const user = await User.findById({ _id: payload.userId })
  await User.findByIdAndUpdate({ _id: payload.userId }, { password: req.body.password }, { new: true })

  // user.password = req.body.password
  // await user.save()

  res.status(200).json({ success: true, message: "Password reset was successful" })
})

module.exports = {
  login, signup, checkLogin, logout, resetPassword, forgotPassword
}