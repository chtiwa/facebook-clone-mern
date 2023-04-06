const Conversation = require('../models/Conversation')
const asyncWrapper = require('../middleware/async-wrapper')

const createConversation = asyncWrapper(async (req, res) => {
  const conversation = await Conversation.create({ members: [req.body.senderId, req.body.receiverId] })
  res.status(201).json(conversation)
})

const getConversations = asyncWrapper(async (req, res) => {
  const conversation = await Conversation.find({ members: { $in: [req.params.userId] } })
  // const conversation = await Conversation.find()
  res.status(200).json(conversation)
})

module.exports = { createConversation, getConversations }