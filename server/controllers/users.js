const User = require('../models/User')
const Post = require('../models/Post')
const Story = require('../models/Story')
const cloudinary = require('../utils/cloudinary')
const asyncWrapper = require('../middleware/async-wrapper')

const getUser = asyncWrapper(async (req, res) => {
  const { username } = req.query
  const user = await User.aggregate([
    { $match: { username: username } },
    { $project: { _id: 1, username: 1, profilePicture: 1, coverPicture: 1 } }
  ])
  res.status(200).json(user)
})

const searchUsers = asyncWrapper(async (req, res) => {
  const { search } = req.query
  const username = new RegExp(search, "i")
  const users = await User.aggregate([
    { $match: { username: username } },
    { $project: { _id: 1, username: 1, profilePicture: 1 } }
  ])
  res.status(200).json(users)
})

const getFreinds = asyncWrapper(async (req, res) => {
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
})

// we only need the ids to compare them the users searched
const getFreindRequestsSent = asyncWrapper(async (req, res) => {
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
})

const getFreindRequestsReceived = asyncWrapper(async (req, res) => {
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
    freindRequestsReceivedList.push({ _id, username, profilePicture })
  })
  res.status(200).json(freindRequestsReceivedList)
})

const sendFreindRequest = asyncWrapper(async (req, res) => {
  // the userId of the requested freind
  const { userId } = req.params
  // add the request to the current user in freindRequestsSent
  // find the current user and add the userId to the freindRequestsSent
  const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { $push: { freindRequestsSent: userId } }, { new: true })
  // find the user that received the freind reqeust and add the current user id to the freindRequestsReceived
  await User.findByIdAndUpdate({ _id: userId }, { $push: { freindRequestsReceived: req.user.userId } }, { new: true })
  res.status(201).json(user.freindRequestsSent)
})

const acceptFreindRequest = asyncWrapper(async (req, res) => {
  // req.user.userId is the current user
  // userId is the user that sent the request
  const { userId } = req.params
  // find the current user and add the userId of the user that sent the freind request to freinds
  const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { $push: { freinds: userId }, $pull: { freindRequestsReceived: userId } }, { new: true })
  // find the user that sent the freind request and add the current user id to the freinds array
  await User.findByIdAndUpdate({ _id: userId }, { $push: { freinds: req.user.userId }, $pull: { freindRequestsSent: req.user.userId } }, { new: true })
  res.status(201).json({ freinds: user.freinds, acceptedUserId: userId })
})

const removeFreind = asyncWrapper(async (req, res) => {
  const { userId } = req.params
  // find the current user and pull the the user id
  const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { $pull: { freinds: userId, freindRequestsSent: userId } }, { new: true })
  // find the user that received the freind request and pull it
  await User.findByIdAndUpdate({ _id: userId }, { $pull: { freinds: req.user.userId, freindRequestsReceived: req.user.userId } }, { new: true })
  res.status(201).json({ freinds: user.freinds, removedUserId: userId })
})

const changeProfilePicture = asyncWrapper(async (req, res) => {
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
  const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { profilePicture: url }, { new: true })
  res.status(201).json(user.profilePicture)
  // modify the user's image stored in the stories and posts
  await Post.updateMany({ createdBy: user._id }, { creatorImage: user.profilePicture })
  await Story.updateMany({ createdBy: user._id }, { profilePicture: user.profilePicture })
  console.log("posts and stories updated!")
})

const changeCoverPicture = asyncWrapper(async (req, res) => {
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
  const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { coverPicture: url }, { new: true })
  res.status(201).json(user.coverPicture)
})

module.exports = { getUser, searchUsers, getFreindRequestsSent, getFreindRequestsReceived, acceptFreindRequest, sendFreindRequest, removeFreind, changeProfilePicture, changeCoverPicture, getFreinds }