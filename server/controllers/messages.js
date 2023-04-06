const Message = require('../models/Message')
const asyncWrapper = require('../middleware/async-wrapper')

const createMessage = asyncWrapper(async (req, res) => {
  const message = await Message.create({ ...req.body })
  res.status(200).json(message)
})

const getMessages = asyncWrapper(async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.conversationId })
  res.status(200).json(messages)
})

module.exports = { getMessages, createMessage }