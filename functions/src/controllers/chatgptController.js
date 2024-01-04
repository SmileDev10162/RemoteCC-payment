require('dotenv').config()
const OpenAI = require('openai')
const asyncHandler = require('../middlewares/asyncHandler')

exports.chatgptTest = asyncHandler(async (req, res) => {
  try {
    const question = req.body.question

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: question }],
      model: 'gpt-3.5-turbo'
    })

    res.status(200).json({
      success: true,
      message: response
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message
    })
  }
})

exports.getResponseFromAI = asyncHandler(async (req, res) => {
  try {
    const question = req.body.question

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: question }],
      model: 'gpt-4'
    })

    let cleanedData = response.choices[0].message.content.replace(/[`]/g, '').replace(/[\n]/g, '')

    let jsonObject = JSON.parse(cleanedData)

    res.status(200).json({
      success: true,
      message: jsonObject
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message
    })
  }
})
