const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: 'AKIATV5P4Q5WGRXXGR53',
  secretAccessKey: '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',
  region: 'us-west-2'
})

const s3 = new AWS.S3()

module.exports = s3
