// const mongoose = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')
const cloudinary = require('../utils/cloudinary')

const getPosts = async (req, res) => {
  try {
    const { page } = req.query
    const startIndex = (Number(page) - 1)
    const posts = await Post.aggregate([
      { $project: { _id: 1, title: 1, file: 1, description: 1 } },
      { $skip: startIndex * 10 },
      { $limit: 10 }
    ])
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getComments = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createPost = async (req, res) => {
  try {
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
    let result
    if (req?.file?.path) {
      result = await cloudinary.uploader.upload(req.file.path, options)
    }
    let url = result?.secure_url || ''
    let format = result?.format || ''
    const post = await Post.create({ ...req.body, description: req.body.description.trim(), createdBy: req.user.userId, creator: req.user.username, createdAt: new Date().toISOString(), file: { url: url, format: format }, creatorImage: user.profilePicture })
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.aggregate([
      { $match: { createdBy: userId } },
      { $project: { _id: 1, title: 1, file: 1, description: 1 } }
    ])
    if (!posts) {
      return res.status(404).json({ message: `No posts` })
    }
    res.status(200).json(posts)
  } catch (error) {
    res.tatus(500).json({ message: error.message })
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    await Post.findByIdAndDelete(id)
    res.status(200).json(id)
  } catch (error) {
    res.tatus(500).json({ message: error.message })
  }
}

const likePost = async (req, res) => {
  try {
    const { id } = req.params
    if (!req.user.userId) {
      return res.status(401).json({ message: `Unauthorized` })
    }
    const likedPost = await Post.findByIdAndUpdate({ _id: id }, {
      $push: { likes: req.user.userId }
    }, { new: true })
    // check likedPost 
    // check if the user has liked the post by mapping trhough the likes array
    res.status(200).json({ likedPost: likedPost, hasLikedPost: hasLikedPost })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const unlikePost = async (req, res) => {
  try {
    const { id } = req.params
    if (!req.user.userId) {
      return res.status(401).json({ message: `Unauthorized` })
    }
    const unlikedPost = await Post.findByIdAndUpdate({ _id: id }, {
      $pull: { likes: req.user.userId }
    }, { new: true })
    res.status(200).json({ unlikedPost: unlikedPost, hasLikedPost: false })
  } catch (error) {
    res.tatus(500).json({ message: error.message })
  }
}

const commentPost = async (req, res) => {
  try {
    const { id } = req.params
    const { comment } = req.body
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
  } catch (error) {
    res.tatus(500).json({ message: error.message })
  }
}

module.exports = { getPosts, getUserPosts, getComments, createPost, deletePost, likePost, unlikePost, commentPost }