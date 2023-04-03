const express = require('express')
const router = express.Router()
const { getPosts, getUserPosts, createPost, getComments, deletePost, likePost, unlikePost, commentPost } = require('../controllers/posts')
const upload = require('../utils/multerPost')

// /api/posts
// router.route('/').get(getPosts).post(upload.single('file'), createPost)
router.route('/').get(getPosts).post(upload.array('files', 5), createPost)
// router.route('/userPosts/:userId')
router.route('/userPosts/:username').get(getUserPosts)
router.route('/likePost/:id').patch(likePost)
router.route('/unlikePost/:id').patch(unlikePost)
router.route('/commentPost/:id').patch(commentPost)
router.route('/comments/:id').get(getComments)
router.route('/:id').delete(deletePost)

module.exports = router