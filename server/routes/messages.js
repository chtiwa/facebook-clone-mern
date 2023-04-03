const express = require('express')
const router = express.Router()
const { getMessages, createMessage } = require('../controllers/messages')

router.route('/').post(createMessage)
router.route('/:conversationId').get(getMessages)
module.exports = router