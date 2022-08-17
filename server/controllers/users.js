const User = require('../models/User')
const cloudinary = require('../utils/cloudinary')

const getFreinds = async (req, res) => {
  try {
    const freinds = await User.aggregate([
      { $match: { username: req.user.username } },
      { $project: { _id: 0, followings: 1 } }
    ])

    res.status(200).json(freinds)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const searchUsers = async (req, res) => {
  try {
    const { search } = req.query
    const users = await User.aggregate([
      { $match: { username: search } },
      { $project: { _id: 1, profilePicture: 1, username: 1 } }
    ])
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const searchFreinds = async (req, res) => {
  try {
    const { search } = req.query
    // get the current user's freinds
    const regUsername = new RegExp(search, "i")
    const followings = await User.find({ _id: req.user.userId }, { followings: { $in: [regUsername] } })

    res.status(200).json(followings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addFreind = async (req, res) => {
  try {
    const { username } = req.params
    // add freinds by username
    const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { $push: { followings: username } }, { new: true })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeFreind = async (req, res) => {
  try {
    const { username } = req.params
    const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { $pull: { followings: username } }, { new: true })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const changeProfilePicture = async (req, res) => {
  try {
    const options = {
      folder: "home/facebook-clone",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    }
    let result
    if (req?.file?.path) {
      result = await cloudinary.uploader.upload(req.file.path, options)
    }
    let url = result?.secure_url || ''
    // let format = result?.format || ''
    const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { profilePicture: url }, { new: true })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const changeCoverPicture = async (req, res) => {
  try {
    const options = {
      folder: "home/facebook-clone",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    }
    let result
    if (req?.file?.path) {
      result = await cloudinary.uploader.upload(req.file.path, options)
    }
    let url = result?.secure_url || ''
    // let format = result?.format || ''
    const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { coverPicture: url }, { new: true })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getFreinds, searchUsers, searchFreinds, addFreind, removeFreind, changeProfilePicture, changeCoverPicture }