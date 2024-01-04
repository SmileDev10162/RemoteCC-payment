// material-ui
import { Grid } from '@mui/material'

// project import
import MainCard from '../../components/MainCard'
import ConfigurationTable from './ConfigurationTable'

// ==============================|| SAMPLE PAGE ||============================== //

const Configurations = () => (
  <Grid item xs={12} md={7} lg={8}>
    <ConfigurationTable />
  </Grid>
)

export default Configurations
