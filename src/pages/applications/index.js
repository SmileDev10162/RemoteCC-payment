// material-ui
import { Grid } from '@mui/material'
import APPTable from './APPTable'

// project import
import MainCard from '../../components/MainCard'

// ==============================|| SAMPLE PAGE ||============================== //

const APPS = () => (
  <Grid item xs={12} md={7} lg={8}>
    <APPTable />
  </Grid>
)

export default APPS
