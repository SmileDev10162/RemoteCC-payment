const express = require('express')
const cors = require('cors')
const functions = require('firebase-functions')

// Import Routes
const chatgpt = require('./src/routes/chatgpt')
const aws = require('./src/routes/aws')

// Create express app
const app = express()

// Body parser
app.use(express.json())

// Cors
app.use(cors())

// Mount routes
app.get('/', async (req, res) => {
  res.send('Welcome Brian, Welcome to RemoteCC')
})

app.use('/chatgpt', chatgpt)
app.use('/aws', aws)

exports.app = functions.https.onRequest(app)
