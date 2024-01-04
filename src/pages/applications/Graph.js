import 'reactflow/dist/style.css'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Drawer,
  Grid,
  Typography,
  ListItemButton,
  ListItemIcon,
  Collapse,
  List,
  Divider,
  FormControl,
  TextField,
  NativeSelect
} from '@mui/material'
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowProvider,
  SelectionMode
} from 'reactflow'
import styled, { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from '../../components/ReactFlowCP/Theme'
import {
  DefaultEventNode,
  CustomEventNode,
  StepNode,
  InvokeNode,
  ConstantNumberNode,
  ConstantStringNode,
  ConstantBooleanNode,
  ComparisonNode,
  OperatorNode,
  ConditionNode,
  PrintNode,
  AlertNode,
  VariableNode,
  SetValueNode,
  FileWriteNode,
  FileReadNode,
  DatabaseWriteNode,
  DatabaseReadNode,
  LoopNode,
  FunctionNode,
  OnRequestNode,
  HTTPResponseNode
} from '../../components/ReactFlowCP/CustomNode'

import { useParams } from 'react-router'

import firebase from '../../config/firebase'
import {
  DefaultEvent,
  Step,
  CustomEvent,
  InvokeEvent,
  ConstantNumber,
  ConstantString,
  ConstantBoolean,
  Comparison,
  Operator,
  Condition,
  Print,
  Alert,
  Variable,
  FunctionN,
  OnRequest,
  SetValue,
  Loop,
  DatabaseRead,
  DatabaseWrite,
  FileRead,
  FileWrite,
  HTTPResponse
} from './Element'
import InputDialog from '../../components/common/InputDialog'
import PaneContextMenu from '../../components/ReactFlowCP/PaneContextMenu'
import NodeContextMenu from '../../components/ReactFlowCP/NodeContextMenu'
import { useDispatch, useSelector } from 'react-redux'
import {
  addNewEdge,
  addNewFunctionParameter,
  addNewNode,
  addNewParameter,
  deleteEdge,
  deleteFunctionParameter,
  deleteNode,
  deleteParameter,
  getAllFunctions,
  getAllParameters,
  getAllVariables,
  getCustomEvent,
  getProperty,
  updatePosition
} from '../../store/actions/applicationActions'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'
import HdrAutoOutlinedIcon from '@mui/icons-material/HdrAutoOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

import { toast } from 'react-toastify'
import { compiler } from './Compiler'

const nodeTypes = {
  startEventNode: DefaultEventNode,
  stopEventNode: DefaultEventNode,
  customEventNode: CustomEventNode,
  stepNode: StepNode,
  invokeNode: InvokeNode,
  constantNumberNode: ConstantNumberNode,
  constantStringNode: ConstantStringNode,
  constantBooleanNode: ConstantBooleanNode,
  comparisonNode: ComparisonNode,
  operatorNode: OperatorNode,
  conditionNode: ConditionNode,
  printNode: PrintNode,
  alertNode: AlertNode,
  variableNode: VariableNode,
  functionNode: FunctionNode,
  onRequestNode: OnRequestNode,
  setValueNode: SetValueNode,
  fileWriteNode: FileWriteNode,
  fileReadNode: FileReadNode,
  databaseWriteNode: DatabaseWriteNode,
  databaseReadNode: DatabaseReadNode,
  loopNode: LoopNode,
  httpResponseNode: HTTPResponseNode
}

const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${props => props.theme.bg};
`

const MiniMapStyled = styled(MiniMap)`
  background-color: ${props => props.theme.bg};

  .react-flow__minimap-mask {
    fill: ${props => props.theme.minimapMaskBg};
  }

  .react-flow__minimap-node {
    fill: ${props => props.theme.nodeBg};
    stroke: none;
  }

  .react-flow__minimap-node {
    fill: ${props => props.theme.nodeColor};
  }
`

const ControlsStyled = styled(Controls)`
  button {
    background-color: ${props => props.theme.controlsBg};
    color: ${props => props.theme.controlsColor};
    border-bottom: 1px solid ${props => props.theme.controlsBorder};

    &:hover {
      background-color: ${props => props.theme.controlsBgHover};
    }

    path {
      fill: currentColor;
    }
  }
`

let rfInstance

const onInit = instance => {
  rfInstance = instance
}

export default function Graph (props) {
  const ref = useRef(null)
  const reactFlowWrapper = useRef(null)
  // const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const dispatch = useDispatch()
  const { id } = useParams()
  const { org_id } = useParams()
  const { screen_id } = useParams()
  const { user, sideBar, styleMode } = useSelector(state => state.auth)
  const { parameters } = useSelector(state => state.Application)

  const theme = styleMode === 'light' ? lightTheme : darkTheme

  const [paneClickPosition, setPaneClickPosition] = useState(null)
  const [nodeClickPosition, setNodeClickPosition] = useState(null)
  const [nodePosition, setNodePosition] = useState(null)

  const [openDialog, setOpenDialog] = useState(false)
  const [seletedNodeID, setSeletedNodeID] = useState('')

  let initialNodes = []
  let initialEdges = []

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [stepTitle, setStepTitle] = useState('')
  const [selectedNode, setSelectedNode] = useState(null)

  const [updatedNode, setUpdatedNode] = useState(null)
  const [updatedEdge, setUpdatedEdge] = useState(null)

  // Drawer function
  const [drawerSection, setDrawerSection] = useState(false)

  useEffect(() => {
    dispatch(getCustomEvent(org_id, id))
    dispatch(getAllVariables(org_id, id, screen_id))
    dispatch(getAllFunctions(org_id, id, screen_id))
    dispatch(getAllParameters(org_id, id, screen_id))

    const organizationRef = firebase.firestore().collection('organizations').doc(org_id)
    const applicationRef = organizationRef.collection('applications').doc(id)
    const screenRef = applicationRef.collection('screens').doc(screen_id)

    // let updated = []

    // const unsubscribe_parameter = screenRef.collection('parameters').onSnapshot(snapshot => {
    //   const updatedParameters = snapshot.docs.map(doc => {
    //     return { ...doc.data(), id: doc.id }
    //   })
    //   setParameters(updatedParameters)
    //   updated = updatedParameters
    // })

    const unsubscribe_node = screenRef
      .collection('graph')
      .where('applicationID', '==', id)
      .onSnapshot(snapshot => {
        const updatedNodeData = snapshot.docs.map(doc => {
          if (doc.data().nodeType === 'StartEvent') {
            return {
              ...DefaultEvent,
              type: 'startEventNode',
              position: doc.data().position,
              id: doc.id,
              data: { label: 'On Start', nodeType: 'graphNode' }
            }
          } else if (doc.data().nodeType === 'StopEvent') {
            return {
              ...DefaultEvent,
              type: 'stopEventNode',
              position: doc.data().position,
              id: doc.id,
              data: { label: 'On Stop', nodeType: 'graphNode' }
            }
          } else if (doc.data().nodeType === 'onRequestNode') {
            return {
              ...OnRequest,
              position: doc.data().position,
              id: doc.id,
              data: { label: 'On Request', parameters: doc.data().parameters, nodeType: 'graphNode' }
            }
          } else if (doc.data().nodeType === 'CustomEvent') {
            return {
              ...CustomEvent,
              data: { label: doc.data().eventName, nodeType: 'graphNode' },
              position: doc.data().position,
              id: doc.id
            }
          } else if (doc.data().nodeType === 'InvokeEvent') {
            return {
              ...InvokeEvent,
              position: doc.data().position,
              data: { value: doc.data().value, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'ConstantNumber') {
            return {
              ...ConstantNumber,
              position: doc.data().position,
              data: { label: 'Number', value: doc.data().value, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'ConstantString') {
            return {
              ...ConstantString,
              position: doc.data().position,
              data: { label: 'String', value: doc.data().value, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'ConstantBoolean') {
            return {
              ...ConstantBoolean,
              position: doc.data().position,
              data: { label: 'Boolean', value: doc.data().value, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'ComparisonNode') {
            return {
              ...Comparison,
              position: doc.data().position,
              data: { label: 'Comparison', value: doc.data().value, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'OperatorNode') {
            return {
              ...Operator,
              position: doc.data().position,
              data: { label: 'Operator', value: doc.data().value, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'ConditionNode') {
            return {
              ...Condition,
              position: doc.data().position,
              data: { label: 'Condition', nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'PrintNode') {
            return {
              ...Print,
              position: doc.data().position,
              data: { label: 'Print', value: doc.data().value, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'AlertNode') {
            return {
              ...Alert,
              position: doc.data().position,
              data: { label: 'Alert', value: doc.data().value, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'SetValueNode') {
            return {
              ...SetValue,
              position: doc.data().position,
              data: { label: 'Set Value', value: doc.data().value, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'Step') {
            return {
              ...Step,
              data: {
                label: doc.data().label,
                value: doc.data().value,
                code: doc.data().code,
                nodeType: 'graphNode'
              },
              position: doc.data().position,
              id: doc.id
            }
          } else if (doc.data().nodeType === 'FileWriteNode') {
            return {
              ...FileWrite,
              position: doc.data().position,
              data: { label: 'File Write', nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'FileReadNode') {
            return {
              ...FileRead,
              position: doc.data().position,
              data: { label: 'File Read', nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'DatabaseWriteNode') {
            return {
              ...DatabaseWrite,
              position: doc.data().position,
              data: { label: 'Databse Write', nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'DatabaseReadNode') {
            return {
              ...DatabaseRead,
              position: doc.data().position,
              data: { label: 'Database Read', nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'VariableNode') {
            return {
              ...Variable,
              position: doc.data().position,
              data: { label: 'Database Read', value: doc.data().value, type: doc.data().type, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'FunctionNode') {
            return {
              ...FunctionN,
              position: doc.data().position,
              data: { label: 'Function', value: doc.data().value, functionID: doc.data().functionID, nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'LoopNode') {
            return {
              ...Loop,
              position: doc.data().position,
              data: { label: 'Loop', nodeType: 'graphNode' },
              id: doc.id
            }
          } else if (doc.data().nodeType === 'HTTPResponseNode') {
            return {
              ...HTTPResponse,
              position: doc.data().position,
              data: { label: 'HTTP Response', nodeType: 'graphNode' },
              id: doc.id
            }
          } else {
            return
          }
        })
        setNodes(updatedNodeData)
        // setUpdatedNode(updatedNodeData)
      })

    const unsubscribe_edge = screenRef.collection('edge').onSnapshot(snapshot => {
      const updatedEdgeData = snapshot.docs.map(doc => {
        return { ...doc.data(), id: doc.id }
      })
      setEdges(updatedEdgeData)
      // setUpdatedEdge(updatedEdgeData)
    })

    return () => {
      unsubscribe_node()
      unsubscribe_edge()
    }
  }, [])

  // useEffect(() => {
  //   compiler(updatedNode, updatedEdge)
  // }, [updatedNode, updatedEdge])

  const onConnect = useCallback(
    params => {
      const newEdge = {
        ...params,
        animated: true,
        markerEnd: {
          type: MarkerType.Arrow
        }
      }

      dispatch(addNewEdge(org_id, id, screen_id, newEdge))
    },
    [setEdges]
  )

  const onPaneContextMenu = useCallback(
    event => {
      event.preventDefault()

      setNodeClickPosition(null)

      const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect()

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top
      }

      setPaneClickPosition({
        top: position.y,
        left: position.x
      })

      setNodePosition(
        props.reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        })
      )
    },
    [props.reactFlowInstance]
  )

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault()

      setPaneClickPosition(null)

      setSeletedNodeID(node.id)

      const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect()

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top
      }

      setNodeClickPosition({
        top: position.y,
        left: position.x
      })
    },
    [setNodeClickPosition]
  )

  const onEdgeContextMenu = useCallback((e, edge) => {
    e.preventDefault()
    dispatch(deleteEdge(org_id, id, screen_id, edge.id))
  })

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(
    e => {
      setPaneClickPosition(null)
      setNodeClickPosition(null)
    },
    [setPaneClickPosition]
  )
  const onNodeClick = useCallback(
    (e, node) => {
      setNodeClickPosition(null)
      setPaneClickPosition(null)
    },
    [setNodeClickPosition]
  )

  const onNodeDoubleClick = useCallback((e, node) => {
    setSelectedNode(node)
    if (node.type !== 'functionNode') {
      setDrawerSection(!drawerSection)
    } else {
      props.functionDoubleClick(node)
    }
  })

  // Start, Stop, Invoke Event and Step event handling
  const handleStartEvent = () => {
    const newNode = {
      nodeType: 'StartEvent',
      position: nodePosition
    }
    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Satrt Event Node')
      })
    )
  }

  const handleStopEvent = () => {
    const newNode = {
      nodeType: 'StopEvent',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Stop Event Node')
      })
    )
  }

  const handleInvokeEvent = () => {
    const newNode = {
      nodeType: 'InvokeEvent',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Invoke Event Node')
      })
    )
  }

  const handleCustomEvent = name => {
    const newNode = {
      eventName: name,
      nodeType: 'CustomEvent',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Node')
      })
    )
  }

  const handleStep = () => {
    setStepTitle('')
    setOpenDialog(true)
  }

  const addNewStep = () => {
    const newNode = {
      nodeType: 'Step',
      label: stepTitle,
      position: nodePosition
    }

    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Node')
      })
    )
    onPaneClick()
  }

  const handleConstantNumber = () => {
    const newNode = {
      nodeType: 'ConstantNumber',
      position: nodePosition,
      value: 0
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Constant Number Node')
      })
    )
  }

  const handleConstantString = () => {
    const newNode = {
      nodeType: 'ConstantString',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Constant String Node')
      })
    )
  }

  const handleConstantBoolean = () => {
    const newNode = {
      nodeType: 'ConstantBoolean',
      position: nodePosition,
      value: true
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Constant Boolean Node')
      })
    )
  }

  const handleComparisonNode = () => {
    const newNode = {
      nodeType: 'ComparisonNode',
      position: nodePosition,
      value: 'EqualTo'
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Comparison Node')
      })
    )
  }

  const handleOperatorNode = () => {
    const newNode = {
      nodeType: 'OperatorNode',
      position: nodePosition,
      value: 'Addition'
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Operator Node')
      })
    )
  }

  const handleConditionNode = () => {
    const newNode = {
      nodeType: 'ConditionNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Condition Number Node')
      })
    )
  }

  const handlePrintNode = () => {
    const newNode = {
      nodeType: 'PrintNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Print Node')
      })
    )
  }

  const handleAlertNode = () => {
    const newNode = {
      nodeType: 'AlertNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Alert Node')
      })
    )
  }

  const handleSetValueNode = () => {
    const newNode = {
      nodeType: 'SetValueNode',
      position: nodePosition,
      value: ''
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new SetValue Node')
      })
    )
  }

  const handleFileWriteNode = () => {
    const newNode = {
      nodeType: 'FileWriteNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new File Write Node')
      })
    )
  }

  const handleFileReadNode = () => {
    const newNode = {
      nodeType: 'FileReadNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new File Write Node')
      })
    )
  }

  const handleDatabaseWriteNode = () => {
    const newNode = {
      nodeType: 'DatabaseWriteNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new File Write Node')
      })
    )
  }

  const handleDatabaseReadNode = () => {
    const newNode = {
      nodeType: 'DatabaseReadNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new File Write Node')
      })
    )
  }

  const handleLoopNode = () => {
    const newNode = {
      nodeType: 'LoopNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new Loop Node')
      })
    )
  }

  const handleOnRequestNode = () => {
    const newNode = {
      nodeType: 'onRequestNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new On Request Node')
      })
    )
  }

  const handleHTTPResponseNode = () => {
    const newNode = {
      nodeType: 'HTTPResponseNode',
      position: nodePosition
    }

    onPaneClick()
    dispatch(
      addNewNode(org_id, id, screen_id, newNode, () => {
        toast.success('Added new HTTP Response Node')
      })
    )
  }

  let dragged = false
  let selectionDragged = false

  // Handle Node move event
  const onNodeDrag = useCallback((event, node) => {
    event.preventDefault()
    dragged = true
  }, [])

  const onNodeDragStop = useCallback((event, node) => {
    event.preventDefault()

    if (dragged) {
      setTimeout(() => {
        updateRelativePosition(node.id, node.position.x, node.position.y)
      }, 200)
      dragged = false
    }
    dragged = false
  }, [])

  // Handle multi selection nodes event
  const onSelectionDrag = useCallback((event, node) => {
    event.preventDefault()
    selectionDragged = true
  }, [])

  const onSelectionDragStop = useCallback((event, nodes) => {
    event.preventDefault()
    for (let i = 0; i < nodes.length; i++) {
      if (selectionDragged) {
        setTimeout(() => {
          updateRelativePosition(nodes[i].id, nodes[i].position.x, nodes[i].position.y)
        }, 200)
      }
    }
    selectionDragged = false
  }, [])

  const updateRelativePosition = (nodeId, x, y) => {
    const newPosition = {
      x: x,
      y: y
    }
    dispatch(updatePosition(org_id, id, screen_id, nodeId, newPosition))
  }

  // Handle variable panel view event
  const [variableFlag, setVariableFlag] = useState(sideBar)

  const toggleVariable = flag => {
    dispatch({
      type: 'VARIABLE_SIDEBAR',
      payload: flag
    })
    setVariableFlag(flag)
  }

  const handleDeleteNode = () => {
    // onNodeClick()
    onPaneClick()
    dispatch(
      deleteNode(org_id, id, screen_id, seletedNodeID, () => {
        toast.success('Deleted the Node')
      })
    )
  }

  // adding parameter for function
  const [parameterName, setParameterName] = useState('')
  const [parameterType, setParameterType] = useState('Number')
  const [parameterDescription, setParameterDescription] = useState('')

  const [openParameterList, setOpenParameterList] = useState(false)
  const [newParameterOpen, setNewParameterOpen] = useState(false)

  const handleParameterListClick = () => {
    setOpenParameterList(!openParameterList)
  }

  const handleNewParameterClick = () => {
    setNewParameterOpen(!newParameterOpen)
  }

  const handleAddParameter = type => {
    if (!parameterName) {
      toast.error('Parameter Name should not be empty')
      return
    } else {
      if (type === 'entryNode') {
        dispatch(
          addNewFunctionParameter(org_id, id, screen_id, props.functionID, parameterName, parameterType, parameterDescription, () => {
            toast.success('Added the new parameter')
            setParameterName('')
            setParameterType('Number')
            setParameterDescription('')
          })
        )
      } else {
        dispatch(
          addNewParameter(org_id, id, screen_id, parameterName, parameterType, parameterDescription, () => {
            toast.success('Added the new parameter')
            setParameterName('')
            setParameterType('Number')
            setParameterDescription('')
          })
        )
      }
    }
  }

  const handleDeleteParameter = (param_id, type) => {
    if (type === 'entryNode') {
      dispatch(
        deleteFunctionParameter(org_id, id, screen_id, props.functionID, param_id, () => {
          toast.success('Deleted the Parameter')
        })
      )
    } else {
      dispatch(
        deleteParameter(org_id, id, screen_id, param_id, () => {
          toast.success('Deleted the Parameter')
        })
      )
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ zIndex: 1000 }}>
        <Grid container spacing={2}>
          <Box height={window.innerHeight - 180} width={'100%'}>
            <div className='dndflow'>
              <ReactFlowProvider>
                <div className='reactflow-wrapper' ref={reactFlowWrapper}>
                  <ReactFlowStyled
                    // ref={ref}
                    onInit={props.setReactFlowInstance}
                    elementsSelectable={true}
                    // selectNodesOnDrag={true}
                    panOnDrag={[1, 1]}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onPaneClick={onPaneClick}
                    onNodeClick={onNodeClick}
                    onNodeDoubleClick={onNodeDoubleClick}
                    onPaneContextMenu={onPaneContextMenu}
                    onNodeContextMenu={onNodeContextMenu}
                    onEdgeContextMenu={onEdgeContextMenu}
                    onNodeDrag={onNodeDrag}
                    onNodeDragStop={onNodeDragStop}
                    onSelectionDrag={onSelectionDrag}
                    onSelectionDragStop={onSelectionDragStop}
                    nodeTypes={nodeTypes}
                    onDrop={props.onDrop}
                    selectionOnDrag
                    selectionMode={SelectionMode.Partial}
                    onDragOver={props.onDragOver}
                    // panOnScroll
                    fitView
                  >
                    <Background />
                    {paneClickPosition && (
                      <PaneContextMenu
                        source={'ScreenGraph'}
                        onPaneClick={onPaneClick}
                        onClick={onPaneClick}
                        location={paneClickPosition}
                        setLocation={setPaneClickPosition}
                        handleStartEvent={handleStartEvent}
                        handleStopEvent={handleStopEvent}
                        handleInvokeEvent={handleInvokeEvent}
                        handleCustomEvent={handleCustomEvent}
                        handleConstantNumber={handleConstantNumber}
                        handleConstantString={handleConstantString}
                        handleConstantBoolean={handleConstantBoolean}
                        handleOperatorNode={handleOperatorNode}
                        handleComparisonNode={handleComparisonNode}
                        handleConditionNode={handleConditionNode}
                        handlePrintNode={handlePrintNode}
                        handleAlertNode={handleAlertNode}
                        handleStep={handleStep}
                        handleSetValueNode={handleSetValueNode}
                        handleFileWriteNode={handleFileWriteNode}
                        handleFileReadNode={handleFileReadNode}
                        handleDatabaseWriteNode={handleDatabaseWriteNode}
                        handleDatabaseReadNode={handleDatabaseReadNode}
                        handleLoopNode={handleLoopNode}
                        handleOnRequestNode={handleOnRequestNode}
                        handleHTTPResponseNode={handleHTTPResponseNode}
                      />
                    )}
                    {nodeClickPosition && <NodeContextMenu location={nodeClickPosition} deleteNode={handleDeleteNode} />}
                    <ControlsStyled />
                    <MiniMapStyled />
                  </ReactFlowStyled>
                </div>
              </ReactFlowProvider>
            </div>
          </Box>
        </Grid>
        <InputDialog
          open={openDialog}
          setOpen={setOpenDialog}
          handleValue={stepTitle}
          handleChange={setStepTitle}
          handleAction={addNewStep}
        />
        <Drawer anchor='right' open={drawerSection} onClose={() => setDrawerSection(false)}>
          <Box sx={{ width: 400 }} role='presentation'>
            <Grid container spacing={2} padding={2}>
              <Grid item xs={12}>
                <Typography align={'center'} fontWeight={'bold'} fontSize={'20px'} marginTop={7}>
                  Node information
                </Typography>
                <Box marginTop={7}>
                  <Typography fontWeight={'bold'} fontSize={18}>
                    Node Type
                  </Typography>
                  <Typography>{selectedNode?.data.label}</Typography>
                  <Typography fontWeight={'bold'} fontSize={18}>
                    ID
                  </Typography>
                  <Typography>{selectedNode?.id}</Typography>
                  <Typography fontWeight={'bold'} fontSize={18}>
                    Value
                  </Typography>
                  <Typography>{selectedNode?.data.value}</Typography>
                  {selectedNode?.type === 'stepNode' && (
                    <Box>
                      <Typography fontWeight={'bold'} fontSize={18}>
                        Function
                      </Typography>
                      <Typography>{selectedNode?.data.code.function}</Typography>
                      <Typography fontWeight={'bold'} fontSize={18}>
                        Parameters
                      </Typography>
                      <Typography>{selectedNode?.data.code.parameter.toString()}</Typography>
                      <Typography fontWeight={'bold'} fontSize={18}>
                        Return
                      </Typography>
                      <Typography>{selectedNode?.data.code.return.toString()}</Typography>
                    </Box>
                  )}
                  {selectedNode?.type === 'onRequestNode' && (
                    <Box>
                      <Typography fontWeight={'bold'} fontSize={18} marginTop={5}>
                        Parameters
                      </Typography>
                      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <ListItemButton sx={{ height: '40px' }} onClick={handleParameterListClick}>
                          {openParameterList ? <ExpandLess /> : <ExpandMore />}
                          <Typography fontWeight={'bold'}>Parameters</Typography>
                        </ListItemButton>
                        <ListItemIcon sx={{ cursor: 'pointer' }} onClick={handleNewParameterClick}>
                          {!newParameterOpen && <AddCircleOutlineOutlinedIcon color='primary' />}
                          {newParameterOpen && <RemoveCircleOutlineOutlinedIcon color='primary' />}
                        </ListItemIcon>
                      </Box>
                      <Collapse in={openParameterList} timeout='auto' unmountOnExit>
                        <List component='div' disablePadding>
                          {parameters?.map((parameter, index) => (
                            <Box component={'div'} key={index}>
                              <ListItemButton
                                sx={{ height: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                              >
                                <Box display={'flex'} alignItems={'center'} marginRight={2}>
                                  <ListItemIcon onClick={() => alert('sdfsfs')} sx={{ cursor: 'pointer' }}>
                                    <HdrAutoOutlinedIcon />
                                  </ListItemIcon>
                                  <Typography>{parameter.name}</Typography>
                                </Box>
                                <Box display={'flex'} alignItems={'center'}>
                                  <Typography>{parameter.type}</Typography>
                                  <ListItemIcon
                                    sx={{ cursor: 'pointer', marginLeft: 1, marginRight: 0 }}
                                    onClick={() => handleDeleteParameter(parameter.id, 'onRequest')}
                                  >
                                    <DeleteOutlineIcon color='error' />
                                  </ListItemIcon>
                                </Box>
                              </ListItemButton>
                            </Box>
                          ))}
                          {newParameterOpen && (
                            <Box>
                              <Divider sx={{ marginBottom: 1 }} />
                              <ListItemButton sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box
                                  sx={{
                                    height: '40px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%'
                                  }}
                                >
                                  <FormControl>
                                    <TextField
                                      placeholder='Name'
                                      value={parameterName}
                                      onChange={e => setParameterName(e.target.value)}
                                      sx={{ marginRight: 1 }}
                                      variant='standard'
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <NativeSelect value={parameterType} onChange={e => setParameterType(e.target.value)}>
                                      <option value={'Number'}>Number</option>
                                      <option value={'String'}>String</option>
                                      <option value={'Boolean'}>Boolean</option>
                                    </NativeSelect>
                                  </FormControl>
                                  <ListItemIcon onClick={() => handleAddParameter('onRequest')} sx={{ cursor: 'pointer' }}>
                                    <CheckOutlinedIcon color='primary' />
                                  </ListItemIcon>
                                </Box>
                                <Box width={'100%'}>
                                  <FormControl fullWidth>
                                    <TextField
                                      multiline
                                      rows={4}
                                      placeholder='Name'
                                      value={parameterDescription}
                                      onChange={e => setParameterDescription(e.target.value)}
                                      sx={{ marginRight: 1 }}
                                      variant='standard'
                                    />
                                  </FormControl>
                                </Box>
                              </ListItemButton>
                            </Box>
                          )}
                        </List>
                      </Collapse>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  )
}
