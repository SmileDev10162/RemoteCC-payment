// material-ui
import { Typography, Grid } from '@mui/material'
import OrdersTable from './OrdersTable'

// project import
import MainCard from '../../components/MainCard'

// ==============================|| SAMPLE PAGE ||============================== //

const Devices = () => (
  <Grid item xs={12} md={7} lg={8}>
    <OrdersTable />
  </Grid>
)

export default Devices
