require('dotenv').config()
const asyncHandler = require('../middlewares/asyncHandler')
const s3 = require('../config/aws-config') // path to your aws-config.js file
const fs = require('fs');
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");

const bucketName = 'rcc-dev'

const accessKeyId = process.env.ACCESS_KEY_ID
const secretAccessKey = process.env.SECRET_ACCESS_KEY
const region = process.env.REGION

exports.getBucket = asyncHandler(async (req, res) => {
  try {
    const params = {
      Bucket: bucketName
    }

    s3.listObjects(params, (err, data) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: err
        })

        return
      } else {
        console.log("data", data)
        res.status(200).json({
          success: true,
          message: data
        })
        return
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message
    })
  }
})

exports.createObject = asyncHandler(async (req, res) => {
  try {
    const { folderName } = req.body

    const params = {
      Bucket: bucketName,
      Key: folderName,

    }

    s3.putObject(params, (err, data) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: err
        })
        return
      } else {
        res.status(200).json({
          success: true,
          message: `Object created successfully: ${folderName}`
        })
        return
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message
    })
  }
})

exports.createFolder = asyncHandler(async (req, res) => {
  try {
    const { folderName } = req.body

    const params = {
      Bucket: bucketName,
      Key: folderName
    }

    s3.putObject(params, (err, data) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: err
        })
        return
      } else {
        res.status(200).json({
          success: true,
          message: `Folder created successfully: ${folderName}`
        })
        return
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message
    })
  }
})

exports.uploadFile = asyncHandler(async (req, res) => {
  try {
    const file = req.body.file;

    console.log('file', file);
    const fileContent = fs.readFileSync('./image.png');
    console.log('fileContent: ', fileContent);
    const filename = file.name;
    const filePath = 'brian-bucket/' + filename;

    const params = {
      Key: filePath,
      Body: fileContent
    };

    // const uploadResult = await s3.upload(params).promise();
    const uploadResult = new Upload({
      client: new S3Client({
          credentials: {
              accessKeyId,
              secretAccessKey
          },
          region
      }),
      params: {
          ACL: 'public-read',
          bucketName,
          Key: `${Date.now().toString()}-${filename}`,
          Body: fileContent
      },
      tags: [], // optional tags
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    })

    res.status(200).json({
      success: true,
      message: `File uploaded successfully: ${filename}`,
      data: uploadResult
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message
    });
  }
});

