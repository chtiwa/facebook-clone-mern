const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
  file: {
    format: String,
    url: String
  },
  profilePicture: {
    type: String
  },
  creator: {
    type: String
  },
  creatorId: {
    type: String
  },
}, { timestamps: true })

module.exports = mongoose.model('Story', StorySchema)