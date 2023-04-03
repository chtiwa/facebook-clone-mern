const Message = require('../models/Message')

const createMessage = async (req, res) => {
  try {
    const message = await Message.create({ ...req.body })
    res.status(200).json(message)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getMessages, createMessage }