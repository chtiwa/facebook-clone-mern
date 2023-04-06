// const mongoose = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')
const cloudinary = require('../utils/cloudinary')
const asyncWrapper = require('../middleware/async-wrapper')

const getPosts = asyncWrapper(async (req, res) => {
  // const posts = await Post.aggregate([
  //   // { $project: { _id: 1, title: 1, file: 1, description: 1,creator,creatorImage } },
  //   { $skip: startIndex * 10 },
  //   { $limit: 10 }
  // ])

  // const { page } = req.query
  // const LIMIT = 10
  // const startIndex = (Number(page) - 1) * LIMIT
  // const total = await Post.countDocuments({})
  // const posts = await Post.find().sort({ createdAt: 1 }).limit(LIMIT).skip(startIndex)

  const currentUser = await User.findById({ _id: req.user.userId })
  const userPosts = await Post.find({ creator: req.user.username }).sort({ createdAt: 1 })
  let freindsPosts = []
  if (currentUser.freinds.length > 0) {
    freindsPosts = await Promise.all(
      currentUser.freinds.map((f) => {
        return Post.find({ createdBy: f }).sort({ createdAt: 1 })
      })
    )
  }
  const posts = userPosts.concat(...freindsPosts)
  res.status(200).json({ posts: posts })
})

const getComments = asyncWrapper(async (req, res) => {
  const { id } = req.params
  // make a limit on the number of posts that could be fetched
  const comments = await Post.aggregate([
    { $match: { _id: id } },
    { $project: { comments: 1 } }
    //   {
    //     $group: {
    //       _id: "$comments", commentsLength: { $count: {} }
    //     }
    //   }
  ])
  res.status(200).json(comments)
})

const createPost = asyncWrapper(async (req, res) => {
  const user = await User.findById({ _id: req.user.userId })
  if (!user) {
    return res.status(404).json({ message: `User wasn't found!` })
  }
  const options = {
    folder: "home/facebook-clone",
    resource_type: "auto",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  }
  let results
  // console.log(req.files)
  // console.log(req.file)
  if (req.files.length > 0) {
    results = await Promise.all(
      req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, options)
      })
    )
  }
  // console.log(results)

  const files = results.map((result) => {
    return { format: result.format, url: result.secure_url }
  })
  // let url = result?.secure_url || ''
  // let format = result?.format || ''
  // const post = await Post.create({ ...req.body, description: req.body.description.trim(), createdBy: req.user.userId, creator: req.user.username, createdAt: new Date().toISOString(), file: { url: url, format: format }, creatorImage: user.profilePicture })
  const post = await Post.create({ ...req.body, description: req.body.description.trim(), createdBy: req.user.userId, creator: req.user.username, createdAt: new Date().toISOString(), files: files, creatorImage: user.profilePicture })
  res.status(201).json(post)
})

const getUserPosts = asyncWrapper(async (req, res) => {
  const { page } = req.query
  const { username } = req.params
  // console.log(username)
  // const LIMIT = 10
  // const startIndex = (Number(page) - 1) * LIMIT
  // const total = await Post.countDocuments({})
  let posts = []
  if (username === undefined) {
    posts = await Post.find({ creator: req.user.username }).sort({ createdAt: 1 })
  } else {
    posts = await Post.find({ creator: username }).sort({ createdAt: 1 })
  }
  res.status(200).json({ posts: posts })
})

const deletePost = asyncWrapper(async (req, res) => {
  const { id } = req.params
  await Post.findByIdAndDelete(id)
  res.status(200).json(id)
})

const likePost = asyncWrapper(async (req, res) => {
  const { id } = req.params
  if (!req.user.userId) {
    return res.status(401).json({ message: `Unauthorized` })
  }
  const likedPost = await Post.findByIdAndUpdate({ _id: id }, {
    $push: { likes: req.user.userId }
  }, { new: true })
  // check likedPost 
  // check if the user has liked the post by mapping trhough the likes array
  res.status(200).json({ likedPost: likedPost, hasLikedPost: true })
})

const unlikePost = asyncWrapper(async (req, res) => {
  const { id } = req.params
  if (!req.user.userId) {
    return res.status(401).json({ message: `Unauthorized` })
  }
  const unlikedPost = await Post.findByIdAndUpdate({ _id: id }, {
    $pull: { likes: req.user.userId }
  }, { new: true })
  res.status(200).json({ unlikedPost: unlikedPost, hasLikedPost: false })
})

const commentPost = asyncWrapper(async (req, res) => {
  const { id } = req.params
  const { comment } = req.body
  // console.log(req.body)
  const user = await User.findById(req.user.userId)
  if (!user) {
    return res.status(404).json({ message: `User wasn't found!` })
  }

  const commentedPost = await Post.findByIdAndUpdate({ _id: id }, {
    $push: {
      comments: {
        comment: comment,
        creatorImage: user.profilePicture
      }
    }
  }, { new: true })
  res.status(201).json({ post: commentedPost })
})

module.exports = { getPosts, getUserPosts, getComments, createPost, deletePost, likePost, unlikePost, commentPost }