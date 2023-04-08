const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  title: {
    type: String
  },
  creator: {
    type: String,
    required: true
  },
  creatorImage: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  // for a single file 
  // file: {
  //   format: String,
  //   url: String
  // },
  files: {
    type: [{ format: String, url: String }]
  },
  likes: {
    type: Array,
    deafult: []
  },
  comments: {
    type: [{ comment: String, creatorImage: String }],
    deafult: []
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema)