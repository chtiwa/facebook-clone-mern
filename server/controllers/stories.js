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
    const user = await User.findById(req.user.userId)
    const userStories = await Story.find({ creatorId: req.user.userId }).sort({ createdAt: 1 }).limit(10)
    const freindsStories = await Promise.all(
      user.freinds.map((freindId) => {
        return Story.find({ creatorId: freindId }).sort({ createdAt: 1 }).limit(10)
      })
    );
    const stories = userStories.concat(...freindsStories)
    res.status(200).json(stories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const deleteStory = async (req, res) => {
  try {
    const stories = await Story.findByIdAndDelete({ _id: req.params.id })
    res.status(204).json({ message: 'Deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createStory, getStories, deleteStory } 