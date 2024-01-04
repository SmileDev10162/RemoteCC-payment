const express = require('express')
const { chatgptTest, getResponseFromAI } = require('../controllers/chatgptController')
const router = express.Router()

router.route('/chatgpt-test').post(chatgptTest)
router.route('/get-response').post(getResponseFromAI)

module.exports = router
