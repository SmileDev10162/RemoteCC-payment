import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import firebase from '../../config/firebase'

// material-ui
import {
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableSortLabel,
  TablePagination,
  TextField,
  Button,
  Drawer,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'

// project import
import Dot from '../../components/@extended/Dot'
import { useDispatch, useSelector } from 'react-redux'
import MainCard from '../../components/MainCard'
import TextFieldForm from '../../components/common/TextFieldForm'
import { toast } from 'react-toastify'
import { deactiveApplication, newApplication } from '../../store/actions/applicationActions'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useNavigate, useParams } from 'react-router'

function createData (trackingNo, name, fat, carbs, protein) {
  return { trackingNo, name, fat, carbs, protein }
}

function descendingComparator (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator (order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort (array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index])
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis?.map(el => el[0])
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'name',
    align: 'center',
    disablePadding: true,
    label: 'Application Name'
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'Application Status'
  }
]

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead (props) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell align='center'>No</TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={index}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align='center'>Actions</TableCell>
      </TableRow>
    </TableHead>
  )
}

const applyFilters = (tableItems, filters) => {
  return tableItems?.filter(tableItem => {
    let matches = true

    if (filters.status && tableItem.status !== filters.status) {
      matches = false
    }

    return matches
  })
}

const applyPagination = (tableItems, page, limit) => {
  return tableItems && tableItems.slice(page * limit, page * limit + limit)
}

OrderTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

// ==============================|| ORDER TABLE - STATUS ||============================== //

const OrderStatus = ({ status }) => {
  let color
  let title

  switch (status) {
    case false:
      color = 'error'
      title = 'Deactive'
      break
    case true:
      color = 'primary'
      title = 'Active'
      break
  }

  return (
    <Stack direction='row' spacing={1} justifyContent={'center'} alignItems='center'>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  )
}

OrderStatus.propTypes = {
  status: PropTypes.bool
}

// ==============================|| ORDER TABLE ||============================== //

export default function APPTable () {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('')

  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    status: null
  })

  const navigate = useNavigate()

  const { org_id } = useParams()

  const [AppName, setAppName] = useState('')

  const isSelected = id => selected.indexOf(id) !== -1

  // user definition
  const dispatch = useDispatch()
  const theme = useTheme()

  const matchs = useMediaQuery(theme.breakpoints.up('sm'))

  const [visibleRows, setVisibleRows] = useState([])
  const { loading } = useSelector(state => state.Application)
  const [rows, setRows] = useState([])

  const [selectedItem, setSelectedItem] = useState('')
  const [selectedItemInfo, setSelectedItemInfo] = useState(null)

  // Drawer function
  const [drawerSection, setDrawerSection] = useState(false)

  // Setting for Dialog
  const [selectedID, setSeletedID] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const docRef = firebase.firestore().collection('organizations').doc(org_id)

    const unsubscribe = docRef.collection('applications').onSnapshot(snapshot => {
      const updatedData = snapshot.docs.map(doc => {
        const name = doc.data().name
        const status = doc.data().status
        const id = doc.id
        return { id, name, status }
      })
      const filtered = updatedData.filter(item => item.status === true)
      setRows(filtered)

      dispatch({
        type: 'GET_APPS',
        payload: updatedData
      })
    })

    // Clean up the listener when component unmounts
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    setVisibleRows(rows)
  }, [rows])

  const handleApplication = () => {
    dispatch(
      newApplication(org_id, AppName, () => {
        setDrawerSection(false)
        setAppName('')
        toast.success('Added new Application')
      })
    )
  }

  const handleApplicationDeactive = () => {
    dispatch(
      deactiveApplication(org_id, selectedID, () => {
        toast.success('The Application is deactived.')
      })
    )
  }

  const handleEditClick = id => {
    navigate(`edit/${id}`)
  }

  const handleClickApplication = row => {
    setSelectedItem(row.id)
    setSelectedItemInfo(row)
  }

  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    let filteredObject = []
    rows?.map(item => {
      if (item.name?.toLocaleLowerCase().includes(searchValue)) {
        filteredObject.push(item)
      }
    })
    setVisibleRows(filteredObject)
  }, [searchValue])

  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  // MUI table setting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    setVisibleRows(stableSort(rows, getComparator(order, orderBy)))
  }, [order, orderBy, page, rowsPerPage])

  const filteredTableItems = applyFilters(visibleRows, filters)
  const paginatedTableData = applyPagination(filteredTableItems, page, rowsPerPage)

  return (
    <Box>
      <Grid container>
        {loading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        <Grid item xs={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant='h5'>Applications</Typography>
          <TextField
            id='outlined-start-adornment'
            placeholder='Search by Name'
            sx={{ width: '250px' }}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </Grid>
        <Grid item mt={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'} xs={12}>
          <Button variant='contained' onClick={() => setDrawerSection(true)} fullWidth={!matchs}>
            New Application
          </Button>
        </Grid>
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
            position: 'relative',
            display: 'block',
            maxWidth: '100%',
            '& td, & th': { whiteSpace: 'nowrap' }
          }}
        >
          <Table
            aria-labelledby='tableTitle'
            sx={{
              '& .MuiTableCell-root:first-of-type': {
                pl: 2
              },
              '& .MuiTableCell-root:last-of-type': {
                pr: 3
              }
            }}
          >
            <OrderTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows?.length} />
            <TableBody>
              {paginatedTableData &&
                paginatedTableData.map((row, index) => {
                  const isItemSelected = isSelected(row.id)

                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      sx={{ cursor: 'pointer' }}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={selectedItem === row.id ? true : false}
                      // onClick={() => {
                      //   handleClickAPI(row)
                      // }}
                    >
                      <TableCell align='center'>{index + 1 + page * rowsPerPage}</TableCell>
                      <TableCell align='center'>{row.name}</TableCell>
                      <TableCell align='center'>
                        <OrderStatus status={row.status} />
                      </TableCell>
                      <TableCell align='center' width={'15%'}>
                        <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
                          <Button
                            variant='contained'
                            color='success'
                            onClick={() => {
                              setSelected(row.id)
                              handleEditClick(row.id)
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant='contained'
                            onClick={() => {
                              setOpenDialog(true)
                              setSeletedID(row.id)
                            }}
                            color='error'
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          className='margin-none'
          count={rows?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </MainCard>

      <ConfirmDialog open={openDialog} setOpen={setOpenDialog} handleAction={handleApplicationDeactive} />

      <Drawer anchor='right' open={drawerSection} onClose={() => setDrawerSection(false)}>
        <Box sx={{ width: 400 }} role='presentation'>
          <Grid container spacing={2} padding={2}>
            {loading ? (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            ) : (
              ''
            )}

            <Grid item xs={12}>
              <Typography fontWeight={'bold'} fontSize={'20px'} marginTop={7}>
                New Application
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextFieldForm title={'Applicatin Name'} value={AppName} setValue={setAppName} type={'text'} />
            </Grid>
            <Grid item xs={12} display={'flex'} mt={5} justifyContent={'space-around'} alignItems={'center'}>
              <Button
                variant='contained'
                onClick={() => {
                  setAppName('')
                }}
                color='error'
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  handleApplication()
                }}
                disabled={!AppName || loading}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>

      {selectedItemInfo !== null ? (
        <>
          <Typography padding={2}>About Device</Typography>
          <MainCard>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Typography>{selectedItemInfo.deviceID}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>{selectedItemInfo.name}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>{selectedItemInfo.type}</Typography>
              </Grid>
            </Grid>
          </MainCard>
        </>
      ) : (
        ''
      )}
    </Box>
  )
}
