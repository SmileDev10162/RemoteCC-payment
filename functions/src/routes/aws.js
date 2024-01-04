const express = require('express')
const { getBucket, createObject, createFolder, uploadFile } = require('../controllers/awsController')
const router = express.Router()

router.route('/get-bucket').post(getBucket)
router.route('/create-object').post(createObject)
router.route('/create-folder').post(createFolder)
router.route('/upload-file').post(uploadFile)

module.exports = router
