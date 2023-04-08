const express = require('express')
const router = express.Router()
const { login, signup, logout, checkLogin, resetPassword, forgotPassword } = require('../controllers/auth')
// const upload = require('../utils/multerUser')

router.route('/login').post(login)
router.route('/signup').post(signup)
router.route('/checkLogin').get(checkLogin)
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:resetToken').patch(resetPassword)

module.exports = router