const express = require('express')
const router = express.Router()
const { createStory, getStories, deleteStory } = require('../controllers/stories')
const authentication = require('../middleware/authentication')
const upload = require('../utils/multerPost')

router.route('/').get(authentication, getStories).post(authentication, upload.single('file'), createStory)
router.route('/:id').delete(deleteStory)
module.exports = router