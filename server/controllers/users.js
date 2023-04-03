const User = require('../models/User')
const cloudinary = require('../utils/cloudinary')

const getUser = async (req, res) => {
  try {
    const { username } = req.query
    const user = await User.aggregate([
      { $match: { username: username } },
      { $project: { _id: 1, username: 1, profilePicture: 1, coverPicture: 1 } }
    ])
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const searchUsers = async (req, res) => {
  try {
    const { search } = req.query
    const username = new RegExp(search, "i")
    const users = await User.aggregate([
      { $match: { username: username } },
      { $project: { _id: 1, username: 1, profilePicture: 1 } }
    ])
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getFreinds = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const friends = await Promise.all(
      user.freinds.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// we only need the ids to compare them the users searched
const getFreindRequestsSent = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    // if (user.freindRequestsSent === undefined) {
    //   return res.status(200).json([])
    // }
    // const freindRequestsSent = await Promise.all(
    //   user.freindRequestsSent.map((friendId) => {
    //     return User.findById(friendId);
    //   })
    // )
    // if (freindRequestsSent.length === 0) {
    //   return res.status(200).json([])
    // }
    // let freindRequestsSentList = [];
    // freindRequestsSent.map((friend) => {
    //   const { _id, username, profilePicture } = friend;
    //   freindRequestsSentList.push({ _id, username, profilePicture });
    // });
    res.status(200).json(user.freindRequestsSent)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 
const getFreindRequestsReceived = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.freindRequestsReceived === undefined) {
      return res.status(200).json([])
    }
    const freindRequestsReceived = await Promise.all(
      user.freindRequestsReceived.map((userId) => {
        return User.findById(userId);
      })
    )
    if (freindRequestsReceived.length === 0) {
      return res.status(200).json([])
    }
    let freindRequestsReceivedList = [];
    freindRequestsReceived.map((userId) => {
      const { _id, username, profilePicture } = userId;
      freindRequestsReceivedList.push({ _id, username, profilePicture });
    });
    res.status(200).json(freindRequestsReceivedList)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const sendFreindRequest = async (req, res) => {
  try {
    // the userId of the requested freind
    const { userId } = req.params
    // add the request to the current user in freindRequestsSent
    // find the current user and add the userId to the freindRequestsSent
    const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { $push: { freindRequestsSent: userId } }, { new: true })
    // find the user that received the freind reqeust and add the current user id to the freindRequestsReceived
    await User.findByIdAndUpdate({ _id: userId }, { $push: { freindRequestsReceived: req.user.userId } }, { new: true })
    res.status(201).json(user.freindRequestsSent)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const acceptFreindRequest = async (req, res) => {
  try {
    // req.user.userId is the current user
    // userId is the user that sent the request
    const { userId } = req.params
    // find the current user and add the userId of the user that sent the freind request to freinds
    const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { $push: { freinds: userId }, $pull: { freindRequestsReceived: userId } }, { new: true })
    // find the user that sent the freind request and add the current user id to the freinds array
    await User.findByIdAndUpdate({ _id: userId }, { $push: { freinds: req.user.userId }, $pull: { freindRequestsSent: req.user.userId } }, { new: true })
    res.status(201).json({ freinds: user.freinds, acceptedUserId: userId })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeFreind = async (req, res) => {
  try {
    const { userId } = req.params
    // find the current user and pull the the user id
    const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { $pull: { freinds: userId, freindRequestsSent: userId } }, { new: true })
    // find the user that received the freind request and pull it
    await User.findByIdAndUpdate({ _id: userId }, { $pull: { freinds: req.user.userId, freindRequestsReceived: req.user.userId } }, { new: true })
    res.status(201).json({ freinds: user.freinds, removedUserId: userId })
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
    res.status(201).json(user.profilePicture)
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
    res.status(201).json(user.coverPicture)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getUser, searchUsers, getFreindRequestsSent, getFreindRequestsReceived, acceptFreindRequest, sendFreindRequest, removeFreind, changeProfilePicture, changeCoverPicture, getFreinds }