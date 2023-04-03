const express = require('express')
const router = express.Router()
const { createStory, getStories, deleteStory } = require('../controllers/stories')
const upload = require('../utils/multerUser')

router.route('/').get(getStories).post(upload.single('file'), createStory)
router.route('/:id').delete(deleteStory)
module.exports = router