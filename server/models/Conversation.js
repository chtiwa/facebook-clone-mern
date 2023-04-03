const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema({
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    deafault: []
  }
}, { timestamps: true })

module.exports = mongoose.model('Conversation', ConversationSchema) 
