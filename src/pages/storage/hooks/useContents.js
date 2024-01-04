import { useQuery } from '@tanstack/react-query'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const bucket_name = 'rcc-dev'
const region = 'us-west-2'
const access_key = 'AKIATV5P4Q5WGRXXGR53'
const secret_key = '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'
const exclude_pattern = '^index\\.html$'

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key
  }
})

const excludeRegex = new RegExp(exclude_pattern || /(?!)/)

const listContents = async prefix => {
  console.debug('Retrieving data from AWS SDK')
  const data = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucket_name,
      Prefix: prefix,
      Delimiter: '/'
    })
  )
  console.debug(`Received data: ${JSON.stringify(data, null, 2)}`)
  return {
    folders:
      data.CommonPrefixes?.filter(({ Prefix }) => !excludeRegex.test(Prefix)).map(({ Prefix }) => ({
        name: Prefix.slice(prefix.length),
        path: Prefix,
        url: `/?prefix=${Prefix}`
      })) || [],
    objects:
      data.Contents?.filter(({ Key }) => !excludeRegex.test(Key)).map(({ Key, LastModified, Size }) => ({
        name: Key.slice(prefix.length),
        lastModified: LastModified,
        size: Size,
        path: Key,
        url: `http://${bucket_name}/${Key}`
      })) || []
  }
}

export const useContents = prefix => {
  return useQuery(['contents', prefix], () => listContents(prefix))
}
