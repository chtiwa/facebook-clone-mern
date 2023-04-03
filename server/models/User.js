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
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
  next()
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ username: this.username, userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcryptjs.compare(candidatePassword, this.password)
  return isMatch
}

UserSchema.methods.resetPasswordJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_PSW_RESET_LIFETIME })
}

module.exports = mongoose.model('User', UserSchema) 