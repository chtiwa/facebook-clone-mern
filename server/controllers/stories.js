const Story = require('../models/Story')
const User = require('../models/User')
const cloudinary = require('../utils/cloudinary')

const createStory = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user.userId })
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
    const url = result?.secure_url || ''
    const format = result?.format || ''
    const story = await Story.create({ ...req.body, creator: req.user.username, creatorId: req.user.userId, profilePicture: user.profilePicture, file: { format: format, url: url } })
    res.status(201).json(story)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getStories = async (req, res) => {
  try {
    const stories = await Story.find().limit(10)
    res.status(200).json(stories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const deleteStory = async (req, res) => {
  try {
    const stories = await Story.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json({ message: 'Deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createStory, getStories, deleteStory } 