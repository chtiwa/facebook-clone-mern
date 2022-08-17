const express = require('express')
const router = express.Router()
const { getPosts, createPost, getComments, deletePost, likePost, unlikePost, commentPost } = require('../controllers/posts')
const authentication = require('../middleware/authentication')
const upload = require('../utils/multerPost')

// /api/posts
router.route('/').get(getPosts).post(authentication, upload.single('file'), createPost)

router.route('/likePost/:id').patch(authentication, likePost)
router.route('/unlikePost/:id').patch(authentication, unlikePost)
router.route('/commentPost/:id').patch(authentication, commentPost)
router.route('/comments/:id').get(getComments)
router.route('/:id').delete(deletePost)

module.exports = router