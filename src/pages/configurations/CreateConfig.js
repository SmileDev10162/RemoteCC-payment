import React from 'react'
import { Box, Grid, Typography, Button } from '@mui/material'
import MainCard from '../../components/MainCard'
import { useNavigate } from 'react-router'

export default function ConfigurationTable () {
  const navigate = useNavigate()

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} display={'flex'} justifyContent={'space-between'}>
          <Typography fontWeight={'bold'} fontSize={'18px'}>
            Hello
          </Typography>
          <Button variant='outlined' onClick={() => navigate(-1)}>
            Back
          </Button>
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            <Typography>New configuration form</Typography>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  )
}
