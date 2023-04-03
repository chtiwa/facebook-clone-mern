require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')

const signup = async (req, res) => {
  try {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10) // 10 days
    res.status(201)
      .cookie("token", token, { httpOnly: true, expires: expires })
      .json({ username: user.username, userId: user._id, profilePicture: user.profilePicture })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
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

    const token = user.createJWT()
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10) // 10 days
    res.status(200)
      .cookie("token", token, { httpOnly: true, expires: expires })
      .json({ username: user.username, userId: user._id, profilePicture: user.profilePicture })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const logout = async (req, res) => {
  try {
    res.status(200)
      .cookie("token", "", { httpOnly: true, expires: new Date(0) })
      .json({ message: 'Log out successful' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const checkLogin = async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(200).json({ isLoggedIn: false })
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById({ _id: payload.userId })
    // store the user image in the localStorage 
    res.status(200).json({ isLoggedIn: true, username: payload.username, userId: payload.userId, profilePicture: user.profilePicture })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const forgotPassword = async (req, res, next) => {
  try {
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
        text: message
        // subject:subject
      })
      res.status(200).json({ success: true, message: `Email was sent successfuly` })
    } catch (error) {
      res.status(400).json({ success: false, message: `Email couldn't be sent` })
    }
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

const resetPassword = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  login, signup, checkLogin, logout, resetPassword, forgotPassword
}