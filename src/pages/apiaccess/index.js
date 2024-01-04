// material-ui
import { Grid } from '@mui/material'
import APITable from './APITable'

// project import
import MainCard from '../../components/MainCard'

// ==============================|| SAMPLE PAGE ||============================== //

const APIAccess = () => (
  <Grid item xs={12} md={7} lg={8}>
    <APITable />
  </Grid>
)

export default APIAccess
