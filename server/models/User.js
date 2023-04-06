const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: 20,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please Provide a valid Email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: ''
  },
  coverPicture: {
    type: String,
    default: ''
  },
  // followers: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   default: []
  // },
  freindRequestsReceived: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  freindRequestsSent: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  freinds: {
    type: [mongoose.Schema.Types.ObjectId],
    deafult: []
  },
  refresh_token: {
    type: String,
    default: ''
  }
}, { timestamps: true })

// UserSchema.pre('save', async function (next) {
//   const salt = await bcryptjs.genSalt(10)
//   this.password = await bcryptjs.hash(this.password, salt)
//   next()
// })

UserSchema.methods.hashPassword = async function (password) {
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(password, salt)
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcryptjs.compare(candidatePassword, this.password)
  return isMatch
}

UserSchema.methods.createRefreshToken = function () {
  const refresh_token = jwt.sign({ name: this.name, userId: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME })
  return refresh_token
}

UserSchema.methods.createAccessToken = function () {
  const access_token = jwt.sign({ name: this.name, userId: this._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME })
  return access_token
}

UserSchema.methods.resetPasswordJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_PSW_RESET_LIFETIME })
}

module.exports = mongoose.model('User', UserSchema) 