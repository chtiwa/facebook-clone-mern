const express = require('express')
const router = express.Router()
const { getUser, searchUsers, getFreindRequestsSent, getFreindRequestsReceived, acceptFreindRequest, sendFreindRequest, removeFreind, changeProfilePicture, changeCoverPicture, getFreinds } = require('../controllers/users')
const upload = require('../utils/multerUser')

router.route('/').get(getFreinds)
router.route('/getUser').get(getUser)
router.route('/searchUsers').get(searchUsers)
router.route('/changeCoverPicture').post(upload.single('file'), changeCoverPicture)
router.route('/changeProfilePicture').post(upload.single('file'), changeProfilePicture)
router.route('/getFreindRequestsSent').get(getFreindRequestsSent)
router.route('/getFreindRequestsReceived').get(getFreindRequestsReceived)
router.route('/sendFreindRequest/:userId').patch(sendFreindRequest)
router.route('/acceptFreindRequest/:userId').patch(acceptFreindRequest)
router.route('/removeFreind/:userId').patch(removeFreind)

module.exports = router