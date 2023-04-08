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
    type: mongoose.Schema.Types.ObjectId
  },
}, { timestamps: true })

module.exports = mongoose.model('Story', StorySchema)