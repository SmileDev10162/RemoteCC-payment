import React, { useState } from 'react'
import { Box, Typography, Button, LinearProgress } from '@mui/material'
import axios from 'axios'
import { toast } from 'react-toastify'
import MainCard from '../../components/MainCard'
import S3Browser from './S3Browser'

const URL = 'http://127.0.0.1:5001/remotecc-ccb45/us-central1/app'

export default function index () {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setFile(file)
    } else {
      setFile(null)
    }
  }

  const handleUpload = async () => {
    try {
      const body = {
        file: file
      }
      console.log("body", body)
      // await axios
      //   .post(`${URL}/aws/upload-file`, body, {
      //     onUploadProgress: progressEvent => {
      //       const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
      //       setProgress(progress)
      //     }
      //   })
      //   .then(() => {
      //     toast.success('Uploaded the file')
      //   })
      //   .catch(error => console.log(error.message))

      await axios
        .post(`${URL}/aws/upload-file`, body)
        .then(() => {
          toast.success('Uploaded the file')
        })
        .catch(error => console.log(error.message))
    } catch (error) {
      console.error('Error uploading file:', error.message)
    }
  }

  return (
    <Box>
      <MainCard>
        <Box width={'100%'}>{progress !== 0 && <LinearProgress sx={{ marginBottom: 2 }} variant='determinate' value={progress} />}</Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <Typography align='left' fontWeight={'bold'} fontSize={18}>
              Storage
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            {file && (
              <Typography marginRight={2} fontWeight={'bold'} fontSize={15}>
                {file.name}
              </Typography>
            )}
            {file ? (
              <Button variant='outlined' sx={{ marginRight: 2 }} onClick={handleUpload}>
                Upload
              </Button>
            ) : (
              <Button variant='outlined' sx={{ marginRight: 2 }} component='label'>
                Select File
                <input type='file' hidden onChange={handleFileChange} />
              </Button>
            )}
            <Button variant='contained'>Create new Folder</Button>
          </Box>
        </Box>
        <S3Browser />
      </MainCard>
    </Box>
  )
}
