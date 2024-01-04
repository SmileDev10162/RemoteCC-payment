import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  NativeSelect,
  TextField,
  Typography,
  Drawer,
  Grid
} from '@mui/material'
import { DockviewReact, Orientation } from 'dockview'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined'
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'
import HdrAutoOutlinedIcon from '@mui/icons-material/HdrAutoOutlined'

import FunctionGraph from './FunctionGraph'

import Graph from './Graph'
import { Icon } from './utils'
import Screen from './Screen'
import {
  addNewFunction,
  addNewNode,
  addNewParameter,
  addNewVariable,
  deleteFunction,
  deleteParameter,
  deleteVariable,
  getProperty,
  savePropertyOfScreen,
  addNewFunctionNode,
} from '../../store/actions/applicationActions'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

let type = 'function_graph'
let panelCount = 0
const panelArray = [];

function addPanel (api, name, functionID) {
  console.log("api", api)
  const panelInfo = {
    id: (++panelCount).toString(),
    title: `${name}`,
    component: 'new_graph',
    params: {
      id: functionID
    }
  }
  api.addPanel(panelInfo);
  panelArray.push(panelInfo)
}

function loadDefaultLayout (api) {
  api.fromJSON({
    grid: {
      root: {
        type: 'branch',
        data: [
          {
            type: 'leaf',
            data: {
              views: ['variables'],
              activeView: 'variables',
              id: 'variables'
            },
            size: 10
          },
          {
            type: 'leaf',
            data: {
              views: ['panel_1'],
              activeView: 'panel_1',
              id: 'graph'
            },
            size: 50
          }
          // {
          //   type: 'leaf',
          //   data: {
          //     views: ['panel_2'],
          //     activeView: 'panel_2',
          //     id: 'screen'
          //   },
          //   size: 50
          // }
        ]
        // size: 300
      },
      //   width: 787.75,
      //   height: 300,
      orientation: Orientation.HORIZONTAL
    },
    panels: {
      panel_1: {
        id: 'panel_1',
        contentComponent: 'graph',
        params: { title: 'Panel 1' },
        title: 'Screen'
      },
      // panel_2: {
      //   id: 'panel_2',
      //   contentComponent: 'screen',
      //   params: { title: 'Panel 2' },
      //   title: 'panel_2'
      // },
      variables: {
        id: 'variables',
        contentComponent: 'variables',
        params: { title: 'Variables' },
        title: 'Variables'
      }
    },
    activeGroup: 'variables'
  })
}

const components = {
  graph: props => {
    return (
      <Box>
        <GraphComponent data={props} />
      </Box>
    )
  },
  function_graph: props => {
    return <Typography>sdfhjh</Typography>
  },
  new_graph: props => {
    const id = props.params?.id
    return <FunctionGraphComponent data={props} functionID={id} />
  },
  screen: props => {
    return (
      <Box>
        <Screen />
      </Box>
    )
  },
  new_screen: props => {
    return <Typography>New Screen</Typography>
  },
  variables: props => {
    return <VariableComponent />
  }
}

function GraphComponent (props) {
  const dispatch = useDispatch()
  const id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()

  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const handleCreateNode = (position, nodeInfo) => {
    const newNode = {
      position: position,
      ...nodeInfo
    }

    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Node')
      })
    )
  }

  const onDragOver = useCallback(event => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    event => {
      event.preventDefault()

      const dataString = event.dataTransfer.getData('application/reactflow')
      const nodeInfo = JSON.parse(dataString)

      handleCreateNode(
        reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        }),
        nodeInfo
      )
    },
    [reactFlowInstance]
  )

  const functionDoubleClick = node => {
    addPanel(props.data.containerApi, node.data.value, node.data.functionID)
  }

  return (
    <>
      <Graph
        reactFlowInstance={reactFlowInstance}
        setReactFlowInstance={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        functionDoubleClick={functionDoubleClick}
      />
    </>
  )
}

function FunctionGraphComponent (props) {
  const dispatch = useDispatch()
  const id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()
  const [api, setApiFunction] = useState()
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const handleCreateNode = (position, nodeInfo) => {
    const newNode = {
      position: position,
      ...nodeInfo
    }

    dispatch(
      addNewFunctionNode(org_id, id, screen_id, props.functionID, newNode, () => {
        toast.success('Added new Node')
      })
    )
  }

  const onDragOver = useCallback(event => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    event => {
      event.preventDefault()

      const dataString = event.dataTransfer.getData('application/reactflow')
      const nodeInfo = JSON.parse(dataString)
      handleCreateNode(
        reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        }),
        nodeInfo
      )
    },
    [reactFlowInstance]
  )

  const functionDoubleClick = node => {
    const existPanel = panelArray.find((panel) => {
      if (panel.params.id === node.data.functionID) {
        return panel.id
      }
    })
    if (!!existPanel) {
      console.log("existPanelId", existPanel.id)
      // api.onDidActivePanelChange(panel => {
      //   type = panel?.id
      // })
    }
    addPanel(props.data.containerApi, node.data.value, node.data.functionID)
  }

  return (
    <>
      <FunctionGraph
        reactFlowInstance={reactFlowInstance}
        setReactFlowInstance={setReactFlowInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        functionID={props.functionID}
        functionDoubleClick={functionDoubleClick}
      />
    </>
  )
}

function VariableComponent () {
  const dispatch = useDispatch()
  const id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()
  const { variables, functions, parameters } = useSelector(state => state.Application)

  const [variableName, setVariableName] = useState('')
  const [variableType, setVariableType] = useState('Number')
  const [functionName, setFunctionName] = useState('')

  // Property
  const [endpointName, setEndpointName] = useState('')
  const [route, setRoute] = useState('')
  const [propertyType, setPropertyType] = useState('Post')

  useEffect(() => {
    dispatch(
      getProperty(org_id, id, screen_id, doc => {
        setEndpointName(doc.endpointName === undefined ? '' : doc.endpointName)
        setRoute(doc.route === undefined ? '' : doc.route)
        setPropertyType(doc.propertyType === undefined ? 'Post' : doc.propertyType)
      })
    )
  }, [])

  const [openVariableList, setOpenVariableList] = useState(false)
  const [newVariableOpen, setNewVariableOpen] = useState(false)
  const [openFunctionList, setOpenFunctionList] = useState(false)
  const [newFunctionOpen, setNewFunctionOpen] = useState(false)

  const onDragStart = useCallback((event, info) => {
    const dataString = JSON.stringify(info)
    event.dataTransfer.setData('application/reactflow', dataString)
    event.dataTransfer.effectAllowed = 'move'
  })

  const handleVariableListClick = () => {
    setOpenVariableList(!openVariableList)
  }

  const handleFunctionListClick = () => {
    setOpenFunctionList(!openFunctionList)
  }

  const handleNewVariableClick = () => {
    setNewVariableOpen(!newVariableOpen)
  }

  const handleNewFunctionClick = () => {
    setNewFunctionOpen(!newFunctionOpen)
  }

  const handleAddVariable = () => {
    if (!variableName) {
      toast.error('Variable Name should not be empty')
      return
    } else {
      dispatch(
        addNewVariable(org_id, id, screen_id, variableName, variableType, () => {
          toast.success('Added the new variable')
          setVariableName('')
          setVariableType('Number')
        })
      )
    }
  }

  const handleAddFunction = () => {
    if (!functionName) {
      toast.error('Function Name should not be empty')
      return
    } else {
      dispatch(
        addNewFunction(org_id, id, screen_id, functionName, () => {
          toast.success('Added the new function')
          setFunctionName('')
        })
      )
    }
  }

  const handleDeleteVariable = var_id => {
    dispatch(
      deleteVariable(org_id, id, var_id, () => {
        toast.success('Deleted the variable')
      })
    )
  }

  const handleDeleteFunction = func_id => {
    dispatch(
      deleteFunction(org_id, id, screen_id, func_id, () => {
        toast.success('Deleted the function')
      })
    )
  }

  const handleSaveProperty = () => {
    const property = {
      endpointName,
      route,
      propertyType
    }
    dispatch(
      savePropertyOfScreen(org_id, id, screen_id, property, () => {
        toast.success('Updated the property for the screen')
      })
    )
  }

  return (
    <Box marginRight={1}>
      <List sx={{ width: '100%' }} component='nav' aria-labelledby='nested-list-subheader'>
        <Box margin={1} width={'100%'}>
          <Typography fontSize={18} fontWeight={'bold'}>
            Properties
          </Typography>
          <FormControl fullWidth>
            <TextField
              placeholder='End Point Name'
              value={endpointName}
              onChange={e => setEndpointName(e.target.value)}
              sx={{ marginRight: 1 }}
              variant='standard'
            />
          </FormControl>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <TextField
              placeholder='Route'
              value={route}
              onChange={e => setRoute(e.target.value)}
              sx={{ marginRight: 1 }}
              variant='standard'
            /> 
          </FormControl>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <NativeSelect value={propertyType} onChange={e => setPropertyType(e.target.value)} sx={{ marginRight: 1 }}>
              <option value={'Post'}>Post</option>
              <option value={'Get'}>Get</option>
              <option value={'Put'}>Put</option>
              <option value={'Delete'}>Delete</option>
            </NativeSelect>
          </FormControl>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <Button onClick={handleSaveProperty} sx={{ marginRight: 1 }}>
              Save property
            </Button>
          </FormControl>
        </Box>
        <Box display={'flex'} marginTop={2} justifyContent={'space-between'} alignItems={'center'}>
          <ListItemButton sx={{ height: '40px' }} onClick={handleVariableListClick}>
            {openVariableList ? <ExpandLess /> : <ExpandMore />}
            <Typography fontWeight={'bold'}>Variables</Typography>
          </ListItemButton>
          <ListItemIcon sx={{ cursor: 'pointer' }} onClick={handleNewVariableClick}>
            {!newVariableOpen && <AddCircleOutlineOutlinedIcon color='primary' />}
            {newVariableOpen && <RemoveCircleOutlineOutlinedIcon color='primary' />}
          </ListItemIcon>
        </Box>
        <Collapse in={openVariableList} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {variables?.map((variable, index) => (
              <Box
                key={index}
                component={'div'}
                onDragStart={event => {
                  onDragStart(event, { id: variable.id, nodeType: 'VariableNode', value: variable.name, type: variable.type })
                }}
                draggable
              >
                <ListItemButton sx={{ height: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box display={'flex'} alignItems={'center'} marginRight={2}>
                    <ListItemIcon onClick={() => alert('sdfsfs')} sx={{ cursor: 'pointer' }}>
                      <DragIndicatorOutlinedIcon />
                    </ListItemIcon>
                    <Typography>{variable.name}</Typography>
                  </Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography>{variable.type}</Typography>
                    <ListItemIcon
                      sx={{ cursor: 'pointer', marginLeft: 1, marginRight: 0 }}
                      onClick={() => handleDeleteVariable(variable.id)}
                    >
                      <DeleteOutlineIcon color='error' />
                    </ListItemIcon>
                  </Box>
                </ListItemButton>
              </Box>
            ))}
            {newVariableOpen && (
              <Box>
                <Divider sx={{ marginBottom: 1 }} />
                <ListItemButton sx={{ height: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControl>
                    <TextField
                      placeholder='Name'
                      value={variableName}
                      onChange={e => setVariableName(e.target.value)}
                      sx={{ marginRight: 1, width: '70px' }}
                      variant='standard'
                    />
                  </FormControl>
                  <FormControl>
                    <NativeSelect value={variableType} onChange={e => setVariableType(e.target.value)} sx={{ width: '90px' }}>
                      <option value={'Number'}>Number</option>
                      <option value={'String'}>String</option>
                      <option value={'Boolean'}>Boolean</option>
                    </NativeSelect>
                  </FormControl>
                  <ListItemIcon onClick={handleAddVariable} sx={{ cursor: 'pointer' }}>
                    <CheckOutlinedIcon color='primary' />
                  </ListItemIcon>
                </ListItemButton>
              </Box>
            )}
          </List>
        </Collapse>

        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <ListItemButton sx={{ height: '40px' }} onClick={handleFunctionListClick}>
            {openFunctionList ? <ExpandLess /> : <ExpandMore />}
            <Typography fontWeight={'bold'}>Functions</Typography>
          </ListItemButton>
          <ListItemIcon sx={{ cursor: 'pointer' }} onClick={handleNewFunctionClick}>
            {!newFunctionOpen && <AddCircleOutlineOutlinedIcon color='primary' />}
            {newFunctionOpen && <RemoveCircleOutlineOutlinedIcon color='primary' />}
          </ListItemIcon>
        </Box>
        <Collapse in={openFunctionList} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {functions?.map((functionItem, index) => (
              <Box
                key={index}
                component={'div'}
                onDragStart={event => {
                  onDragStart(event, { id: functionItem.id, nodeType: 'FunctionNode', value: functionItem.name })
                }}
                draggable
              >
                <ListItemButton sx={{ height: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box display={'flex'} alignItems={'center'} marginRight={2}>
                    <ListItemIcon sx={{ cursor: 'pointer' }}>
                      <DragIndicatorOutlinedIcon />
                    </ListItemIcon>
                    <Typography>{functionItem.name}</Typography>
                  </Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <ListItemIcon sx={{ cursor: 'pointer', marginLeft: 1 }} onClick={() => handleDeleteFunction(functionItem.id)}>
                      <DeleteOutlineIcon color='error' />
                    </ListItemIcon>
                  </Box>
                </ListItemButton>
              </Box>
            ))}
            {newFunctionOpen && (
              <Box>
                <Divider sx={{ marginBottom: 1 }} />
                <ListItemButton sx={{ height: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControl fullWidth>
                    <TextField
                      placeholder='Function Name'
                      value={functionName}
                      onChange={e => setFunctionName(e.target.value)}
                      sx={{ marginRight: 1 }}
                      variant='standard'
                    />
                  </FormControl>
                  <ListItemIcon onClick={handleAddFunction} sx={{ cursor: 'pointer' }}>
                    <CheckOutlinedIcon color='primary' />
                  </ListItemIcon>
                </ListItemButton>
              </Box>
            )}
          </List>
        </Collapse>
      </List>
    </Box>
  )
}

export default function Application (props) {
  const { drawerOpen } = useSelector(state => state.menu)
  const { loading } = useSelector(state => state.Application)

  const navigate = useNavigate()

  const [api, Function] = useState()
  const [apiFunction, FunctionFunction] = useState()

  const load = api => {
    api.clear()
    loadDefaultLayout(api)
  }

  const onReady = event => {
    load(event.api)
    Function(event.api)
  }

  useEffect(() => {
    if (!api) {
      return () => {
        //noop
      }
    }

    const disposables = [
      api.onDidActiveGroupChange(panel => {
        type = panel?.id
      }),
      api.onDidAddPanel(panel => {
        type = panel?.id
      }),
      api.onDidActivePanelChange(panel => {
        console.log("api", api)
        type = panel?.id
      })
    ]


    return () => {
      disposables.forEach(disposable => disposable.dispose())
    }
  }, [api])

  useEffect(() => {
    if (!apiFunction) {
      return () => {
        //noop
      }
    }

    const disposables = [
      apiFunction.onDidActiveGroupChange(panel => {
        type = panel?.id
      }),
    ]

    return () => {
      disposables.forEach(disposable => disposable.dispose())
    }
  }, [apiFunction])

  // Setting style mode
  const { styleMode } = useSelector(state => state.auth)

  return (
    <Box>
      {loading && <LinearProgress />}
      <Box width={'100%'} display={'flex'} justifyContent={'space-between'} marginBottom={1}>
        <Typography fontSize={20} fontWeight={'bold'}>
          Edit Application
        </Typography>
        <Button variant='outlined' onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
      <Box width={'100%'}>
        <Box
          sx={{
            border: 'solid',
            borderColor: 'black',
            borderWidth: '1px',
            width: `${drawerOpen ? window.innerWidth - 310 : window.innerWidth - 50}px`,
            height: window.innerHeight - 160
          }}
        >
          <DockviewReact
            components={components}
            onReady={onReady}
            watermarkComponent={Watermark}
            leftHeaderActionsComponent={LeftComponent}
            className={props.theme || `${styleMode === 'light' ? 'dockview-theme-light' : 'dockview-theme-abyss'}`}
          />
        </Box>
      </Box>
    </Box>
  )
}

const LeftComponent = props => {
  const onClick = () => {
    addPanel(props.containerApi, type)
  }
  return (
    <div style={{ height: '100%', color: 'white', padding: '0px 4px' }}>
      <Icon onClick={onClick} />
    </div>
  )
}

const Watermark = props => {
  const reload = () => {
    loadDefaultLayout(props.containerApi)
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography fontWeight={'bold'} fontSize={20}>
          This is panel for Application Graph and Screen. You can put whatever Application graph and screen you want here
        </Typography>
        <Box marginTop={3} display={'flex'} justifyContent={'space-around'}>
          <Button variant='outlined' onClick={reload}>
            Reload
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
