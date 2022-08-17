const express = require('express')
const router = express.Router()
const { getFreinds, searchUsers, searchFreinds, addFreind, removeFreind, changeProfilePicture, changeCoverPicture } = require('../controllers/users')
const authentication = require('../middleware/authentication')
const upload = require('../utils/multerUser')

router.route('/').get(authentication, getFreinds)
router.route('/searchUsers').get(authentication, searchUsers)
router.route('/searchFreinds').get(authentication, searchFreinds)
router.route('/changeCoverPicture').post(authentication, upload.single('file'), changeCoverPicture)
router.route('/changeProfilePicture').post(authentication, upload.single('file'), changeProfilePicture)
router.route('/addFreind/:username').patch(authentication, addFreind)
router.route('/removeFreind/:username').patch(authentication, removeFreind)

module.exports = router