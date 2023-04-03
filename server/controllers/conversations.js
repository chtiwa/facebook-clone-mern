const Conversation = require('../models/Conversation')

const createConversation = async (req, res) => {
  try {
    const conversation = await Conversation.create({ members: [req.body.senderId, req.body.receiverId] })
    res.status(201).json(conversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getConversations = async (req, res) => {
  try {
    const conversation = await Conversation.find({ members: { $in: [req.params.userId] } })
    // const conversation = await Conversation.find()
    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createConversation, getConversations }