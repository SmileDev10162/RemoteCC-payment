// material-ui
import { Grid, Box, Stack, Typography, FormControl, MenuItem, Select, Button, TextField, LinearProgress } from '@mui/material'
import { toast } from 'react-toastify'
import firebase from '../../config/firebase'

// project import
import MainCard from '../../components/MainCard'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { deleteEndpoint, saveNewEndpoint } from '../../store/actions/applicationActions'
import InputDialog from '../../components/common/InputDialog'
import ConfirmDialog from '../../components/common/ConfirmDialog'

// ==============================|| SAMPLE PAGE ||============================== //

function NewEndpoint () {
  const { id } = useParams()
  const { org_id } = useParams()
  const navigate = useNavigate()

  const { loading } = useSelector(state => state.Application)

  const dispatch = useDispatch()
  const [selectedItem, setSeletedItem] = useState('')
  const [version, setVersion] = useState('1.0')

  const [endpointName, setEndpointName] = useState('')

  const [endpointList, setEndpointList] = useState([])

  const [openInputDialog, setOpenInputDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  useEffect(() => {
    const organizationRef = firebase.firestore().collection('organizations').doc(org_id)
    const applicationRef = organizationRef.collection('applications').doc(id)

    const unsubscribe = applicationRef.collection('screens').onSnapshot(snapshot => {
      const updatedData = snapshot.docs.map(doc => {
        const endpointName = doc.data().endpointName
        const createdAt = doc.data().createdAt
        const id = doc.id
        return { id, endpointName, createdAt }
      })
      setEndpointList(updatedData)
    })

    // Clean up the listener when component unmounts
    return () => unsubscribe()
  }, [])

  const addNewEndpointCP = () => {
    const newEndpoint = {
      endpointName
    }
    dispatch(
      saveNewEndpoint(org_id, id, newEndpoint, () => {
        toast.success('Added new endpoint')
      })
    )
  }

  const handleDeleteEndpoint = () => {
    dispatch(
      deleteEndpoint(org_id, id, selectedItem, () => {
        toast.success('Deleted the endpoint')
      })
    )
  }

  const handleRedirectToGraph = id => {
    navigate(`screens/${id}`)
  }

  return (
    <Box>
      <Grid container>
        {loading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        <Grid item xs={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography fontSize={18} fontWeight={'bold'}>
              Version
            </Typography>
            <FormControl sx={{ minWidth: 120, marginLeft: 1 }} size='small'>
              <Select labelId='demo-select-small-label' id='demo-select-small' value={version} onChange={e => setVersion(e.target.value)}>
                <MenuItem value={'1.0'}>1.0</MenuItem>
                <MenuItem value={'2.0'}>2.0</MenuItem>
                <MenuItem value={'2.1'}>2.1</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            onClick={() => {
              setEndpointName('')
              setOpenInputDialog(true)
            }}
            variant='contained'
          >
            New Endpoint
          </Button>
        </Grid>
        <Box marginTop={2}>
          {endpointList.map((item, index) => (
            <Grid container spacing={2} key={index} marginBottom={4}>
              <Grid item xs={12} lg={8} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography fontSize={15} fontWeight={'bold'}>
                  Endpoint Name : {item.endpointName}
                </Typography>
                <Stack direction={'row'} spacing={1}>
                  <Button
                    variant='contained'
                    onClick={() => {
                      handleRedirectToGraph(item.id)
                    }}
                    color='success'
                  >
                    Edit
                  </Button>
                  <Button
                    variant='contained'
                    onClick={() => {
                      setOpenConfirmDialog(true)
                      setSeletedItem(item.id)
                    }}
                    color='error'
                  >
                    Delete
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} lg={4}>
                <FormControl fullWidth>
                  <TextField />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormControl fullWidth>
                  <TextField placeholder='Description' multiline rows={4} />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={4}>
                <FormControl fullWidth>
                  <TextField multiline rows={4} />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormControl fullWidth>
                  <TextField multiline rows={4} />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={4}>
                <FormControl fullWidth>
                  <TextField multiline rows={4} />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={8}>
                <FormControl fullWidth>
                  <TextField multiline rows={4} />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={4}>
                <FormControl fullWidth>
                  <TextField multiline rows={4} />
                </FormControl>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Grid>

      <InputDialog
        open={openInputDialog}
        setOpen={setOpenInputDialog}
        handleValue={endpointName}
        handleChange={setEndpointName}
        handleAction={addNewEndpointCP}
      />

      <ConfirmDialog open={openConfirmDialog} setOpen={setOpenConfirmDialog} handleAction={handleDeleteEndpoint} />
    </Box>
  )
}

export default NewEndpoint
