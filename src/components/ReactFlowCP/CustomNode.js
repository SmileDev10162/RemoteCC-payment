import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Handle, Position } from 'reactflow'
import styled from 'styled-components'
import firebase from '../../config/firebase'

import {
  getFunctionDetail,
  updateComparisonNode,
  updateConstantNode,
  updateInvokeEvent,
  updateOperatorNode,
  updateSetValueNode,
  updateStepDetail
} from '../../store/actions/applicationActions'
import { getResponse } from '../../store/repository/chatgptRepository'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import { addition_question } from '../../config/additionQuestion'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import InformationModal from '../common/InformationModal'
import {
  getFunctionNodeDetail,
  updateFunctionComparisonNode,
  updateFunctionConstantNode,
  updateFunctionOperatorNode,
  updateFunctionSetValueNode,
  updateFunctionStepDetail
} from '../../store/actions/applicationFunctionActions'

const Node = styled.div`
  border-radius: 5px;
  background: ${props => props.theme.nodeBg};
  color: ${props => props.theme.nodeColor};

  .react-flow__handle {
    background: '#f2f2f5';
    width: 8px;
    height: 15px;
    border-radius: 3px;
    background-color: '#2196F3';
  }
`

const EventNode = styled.div`
  color: ${props => props.theme.eventNodeColor};

  .react-flow__handle {
    background-color: '#2196F3';
    background: '#ddd';
    width: 8px;
    height: 15px;
    border-radius: 3px;
  }
`

export const DefaultEventNode = ({ data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <div style={{ backgroundColor: 'LemonChiffon', height: '30px' }}>
        <Typography fontWeight={'bold'} align='center' fontSize={18}>
          {'Event'}
        </Typography>
      </div>
      <div style={{ height: '30px' }}>
        <Typography fontWeight={'bold'} marginTop={1} align='center'>
          {data.label}
        </Typography>
      </div>
      <Handle type='source' position={Position.Right} />
    </EventNode>
  )
}

export const OnRequestNode = ({ data, selected }) => {
  const { parameters } = useSelector(state => state.Application)

  return (
    <EventNode
      selected={selected}
      style={{
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <div style={{ backgroundColor: 'LemonChiffon', height: '30px' }}>
        <Typography fontWeight={'bold'} align='center' fontSize={18}>
          {'onRequest'}
        </Typography>
      </div>
      <div>
        {parameters?.map((param, index) => (
          <Typography key={index} fontWeight={'bold'} marginRight={1} align='right'>
            {param.name}
          </Typography>
        ))}
      </div>
      <Handle type='source' id='inRequest_source' style={{ top: 15 }} position={Position.Right} />
      {parameters?.map((param, index) => (
        <Handle type='source' key={index} id={param.id} style={{ top: `${40 + index * 22}px` }} position={Position.Right} />
      ))}
    </EventNode>
  )
}

export const CustomEventNode = ({ data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <div style={{ backgroundColor: 'LightCyan', height: '30px' }}>
        <Typography fontWeight={'bold'} align='center' fontSize={18}>
          {'Custom Event'}
        </Typography>
      </div>
      <div style={{ height: '30px' }}>
        <Typography fontWeight={'bold'} marginTop={1} align='center'>
          {data.label}
        </Typography>
      </div>
      <Handle type='source' position={Position.Right} />
    </EventNode>
  )
}

export const StepNode = ({ id, data, selected }) => {
  const [stepDetail, setStepDetail] = useState(data.value)
  const dispatch = useDispatch()
  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()

  const [functionDetail, setFunctionDetail] = useState('')

  const [modal, setModal] = useState(false)

  const handleViewFunction = () => {
    if (data.nodeType === 'functionNode') {
      dispatch(
        getFunctionNodeDetail(org_id, app_id, screen_id, data.functionID, id, detail => {
          setFunctionDetail(detail.code.function)
          setModal(true)
        })
      )
    } else {
      dispatch(
        getFunctionDetail(org_id, app_id, screen_id, id, detail => {
          setFunctionDetail(detail.code.function)
          setModal(true)
        })
      )
    }
  }

  const updateStep = () => {
    dispatch({
      type: 'APP_LOADING_TRUE'
    })

    const payload = {
      question: addition_question + stepDetail
    }
    getResponse(payload, res => {
      dispatch({
        type: 'APP_LOADING_TRUE'
      })

      if (!res.data.success) {
        toast.error('Received the bad response from AI. Again try!')
        dispatch({
          type: 'APP_LOADING_FALSE'
        })
      } else {
        const response = res.data.message

        const code = {
          function: response.Function,
          parameter: typeof response.Parameters === 'object' ? response.Parameters : JSON.parse(response.Parameters.replace(/[']/g, '"')),
          return: response.Return.replace(/[']/g, '')
        }

        if (data.nodeType === 'functionNode') {
          dispatch(
            updateFunctionStepDetail(org_id, app_id, screen_id, data.functionID, id, stepDetail, code, () => {
              toast.success('Updated the detail for Step Node')
            })
          )
        } else {
          dispatch(
            updateStepDetail(org_id, app_id, screen_id, id, stepDetail, code, () => {
              toast.success('Updated the detail for Step Node')
            })
          )
        }

        dispatch({
          type: 'APP_LOADING_FALSE'
        })
      }
    })
  }

  return (
    <>
      <Node
        selected={selected}
        style={{
          width: '200px',
          boxShadow: `${
            !selected
              ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
              : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
          }`
        }}
      >
        <div style={{ height: '30px', backgroundColor: 'Lavender' }}>
          <Typography color={'black'} fontWeight={'bold'} align='center' fontSize={18}>
            {data.label}
          </Typography>
        </div>
        <div>
          <Handle type='target' id='step_target' style={{ top: 15 }} position={Position.Left} />
          <Handle type='source' id='step_source' style={{ top: 15 }} position={Position.Right} />
        </div>
        <div style={{ borderStyle: 'solid none none none', borderWidth: '1px', height: '25px', backgroundColor: '#eee' }}>
          <Typography fontWeight={'bold'} color={'black'} align='center' fontSize={15}>
            Input
          </Typography>
        </div>
        <div style={{ padding: '10px' }}>
          <textarea
            type='text'
            multiple
            rows={3}
            style={{ width: '100%', border: 'solid', borderWidth: 1, borderRadius: 5 }}
            value={stepDetail}
            onChange={e => setStepDetail(e.target.value)}
          />
          <div style={{ display: 'flex' }}>
            <button style={{ width: '100%', marginTop: 1 }} onClick={updateStep}>
              Update
            </button>
            <button style={{ marginLeft: '10px' }} onClick={() => handleViewFunction()}>
              {data.code && <RemoveRedEyeOutlinedIcon sx={{ width: '15px', height: '15px' }} />}
            </button>
          </div>
        </div>
        {data.code &&
          Object.keys(data.code?.parameter)?.map((param, index) => (
            <div
              style={{
                height: '25px',
                backgroundColor: '#ddd',
                borderStyle: 'none none none solid',
                borderWidth: '1px 1px 1px 10px',
                borderColor: 'Chartreuse'
              }}
              key={index}
            >
              <Typography color={'black'} align='center' fontSize={15}>
                {param}
              </Typography>
              <Handle
                type='target'
                id={'parameter_' + index + '_target'}
                style={{ top: `${index * 25 + 167}px`, backgroundColor: 'Chartreuse' }}
                position={Position.Left}
              />
            </div>
          ))}
        <div style={{ borderStyle: 'solid none none none', borderWidth: '1px', height: '25px', backgroundColor: '#eee' }}>
          <Typography fontWeight={'bold'} color={'black'} align='center' fontSize={15}>
            Output
          </Typography>
        </div>
        {data.code && (
          <div
            style={{
              height: '25px',
              backgroundColor: '#ddd',
              borderStyle: 'none solid none none',
              borderWidth: '1px 10px 1px 1px',
              borderColor: '#2196F3'
            }}
          >
            <Typography color={'black'} align='center' fontSize={15}>
              Return
            </Typography>
            <Handle
              type='source'
              id={'return_source'}
              style={{ left: 200, bottom: 5, backgroundColor: '#2196F3' }}
              position={Position.Bottom}
            />
          </div>
        )}
      </Node>
      <InformationModal open={modal} setOpen={setModal} detail={functionDetail} />
    </>
  )
}

export const InvokeNode = ({ id, data, selected }) => {
  const dispatch = useDispatch()

  const { customEvents } = useSelector(state => state.Application)

  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()

  const [selectedEvent, setSelectedEvent] = useState(data.value)

  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='invoke_target' position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: '#E0FFE0' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Invoke Event
        </Typography>
      </div>
      <div style={{ padding: '10px' }}>
        <select
          value={selectedEvent}
          onChange={e => {
            setSelectedEvent(e.target.value)
            if (e.target.value !== '') dispatch(updateInvokeEvent(org_id, app_id, screen_id, id, e.target.value))
          }}
          style={{ width: '100%', height: '30px', border: 'solid', borderWidth: 1, borderRadius: 5 }}
        >
          <option value={''}>--Select the Event--</option>
          {customEvents.map((customEvent, index) => (
            <option key={index} value={customEvent.id}>
              {customEvent.name}
            </option>
          ))}
        </select>
      </div>
      <Handle type='source' id='invoke_source' style={{ bottom: '10px' }} position={Position.Right} />
    </EventNode>
  )
}

export const ConstantNumberNode = ({ id, data, selected }) => {
  const dispatch = useDispatch()
  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()

  const [number, setNumber] = useState(data.value)

  const handleNumberUpdate = () => {
    if (isNaN(Number(number))) {
      toast.warn('Should be number')
    } else {
      if (data.nodeType === 'functionNode') {
        dispatch(
          updateFunctionConstantNode(org_id, app_id, screen_id, data.functionID, id, number, () => {
            toast.success('Updated the Number node')
          })
        )
      } else {
        dispatch(
          updateConstantNode(org_id, app_id, screen_id, id, number, () => {
            toast.success('Updated the Number node')
          })
        )
      }
    }
  }

  return (
    <EventNode
      selected={selected}
      style={{
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <div style={{ backgroundColor: 'Chartreuse', height: '30px' }}>
        <Typography fontWeight={'bold'} align='center' fontSize={15}>
          {'Number'}
        </Typography>
      </div>
      <div style={{ padding: '10px' }}>
        <input value={number} style={{ width: '100%' }} onChange={e => setNumber(e.target.value)}></input>
        <button style={{ marginTop: '10px', width: '100%' }} onClick={handleNumberUpdate}>
          Update
        </button>
      </div>
      <Handle type='source' position={Position.Right} />
    </EventNode>
  )
}

export const ConstantStringNode = ({ id, data, selected }) => {
  const dispatch = useDispatch()
  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()

  const [str, setStr] = useState(data.value)

  const handleStringUpdate = () => {
    if (data.nodeType === 'functionNode') {
      dispatch(
        updateFunctionConstantNode(org_id, app_id, screen_id, data.functionID, id, str, () => {
          toast.success('Updated the String node')
        })
      )
    } else {
      dispatch(
        updateConstantNode(org_id, app_id, screen_id, id, str, () => {
          toast.success('Updated the String node')
        })
      )
    }
  }

  return (
    <EventNode
      selected={selected}
      style={{
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <div style={{ backgroundColor: 'Chartreuse', height: '30px' }}>
        <Typography fontWeight={'bold'} align='center' fontSize={15}>
          {'String'}
        </Typography>
      </div>
      <div style={{ padding: '10px' }}>
        <input style={{ width: '100%' }} value={str} onChange={e => setStr(e.target.value)}></input>
        <button style={{ marginTop: '10px', width: '100%' }} onClick={handleStringUpdate}>
          Update
        </button>
      </div>
      <Handle type='source' position={Position.Right} />
    </EventNode>
  )
}

export const ConstantBooleanNode = ({ id, data, selected }) => {
  const dispatch = useDispatch()
  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()

  const [flag, setFlag] = useState(data.value)

  const handleBooleanUpdate = value => {
    setFlag(value)
    if (value !== '')
      if (data.nodeType === 'functionNode') {
        dispatch(
          updateFunctionConstantNode(org_id, app_id, screen_id, data.functionID, id, value, () =>
            toast.success('Updated the Constant Boolean')
          )
        )
      } else {
        dispatch(updateConstantNode(org_id, app_id, screen_id, id, value, () => toast.success('Updated the Constant Boolean')))
      }
  }

  return (
    <EventNode
      selected={selected}
      style={{
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <div style={{ backgroundColor: 'Chartreuse', height: '30px' }}>
        <Typography fontWeight={'bold'} align='center' fontSize={15}>
          {'Boolean'}
        </Typography>
      </div>
      <div style={{ padding: '10px' }}>
        <select
          value={flag}
          onChange={e => handleBooleanUpdate(e.target.value)}
          style={{ width: '100%', height: '30px', border: 'solid', borderWidth: 1, borderRadius: 5 }}
        >
          <option value={'True'}>{'True'}</option>
          <option value={'False'}>{'False'}</option>
        </select>
      </div>
      <Handle type='source' position={Position.Right} />
    </EventNode>
  )
}

export const ConditionNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='condition_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='condition_input_target' style={{ top: '60px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'RoyalBlue' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Condition
        </Typography>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '10px', width: '50%', height: '60px' }}>
          <Typography align='left' marginTop={'10px'}>
            Condition
          </Typography>
        </div>
        <div style={{ padding: '10px', width: '50%', height: '60px' }}>
          <Typography align='right'>True</Typography>
          <Typography align='right'>False</Typography>
        </div>
      </div>
      <Handle type='source' id='condition_true_source' style={{ top: '50px' }} position={Position.Right} />
      <Handle type='source' id='condition_false_source' style={{ top: '70px' }} position={Position.Right} />
    </EventNode>
  )
}

export const ComparisonNode = ({ id, data, selected }) => {
  const dispatch = useDispatch()

  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()

  const [symbol, setSymbol] = useState(data.value)

  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='comparison_execution_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='comparison_input1_target' style={{ top: '40px' }} position={Position.Left} />
      <Handle type='target' id='comparison_input2_target' style={{ top: '70px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'RoyalBlue' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Comparison
        </Typography>
      </div>
      <div style={{ padding: '10px' }}>
        <select
          value={symbol}
          onChange={e => {
            setSymbol(e.target.value)
            if (e.target.value !== '') {
              if (data.nodeType === 'functionNode') {
                dispatch(
                  updateFunctionComparisonNode(org_id, app_id, screen_id, data.functionID, id, e.target.value, () =>
                    toast.success('Updated the Comparison Symbol')
                  )
                )
              } else {
                dispatch(
                  updateComparisonNode(org_id, app_id, screen_id, id, e.target.value, () => toast.success('Updated the Comparison Symbol'))
                )
              }
            }
          }}
          style={{ width: '100%', height: '30px', border: 'solid', borderWidth: 1, borderRadius: 5 }}
        >
          <option value={'EqualTo'}>{'=='}</option>
          <option value={'GreaterThan'}>{'>'}</option>
          <option value={'LessThan'}>{'<'}</option>
          <option value={'GreaterThanEqualTo'}>{'>='}</option>
          <option value={'LessThanEqualTo'}>{'<='}</option>
          <option value={'LogicalAnd'}>{'&&'}</option>
          <option value={'LogicalOr'}>{'||'}</option>
        </select>
      </div>
      <Handle type='source' id='comparison_output_source' style={{ top: '55px' }} position={Position.Right} />
    </EventNode>
  )
}

export const PrintNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='print_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='print_output' style={{ top: '60px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'RoyalBlue' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Print
        </Typography>
      </div>
      <div style={{ height: '60px' }}>
        <Typography paddingTop={1} align='center'></Typography>
      </div>
      <Handle type='source' id='print_source' style={{ top: '15px' }} position={Position.Right} />
    </EventNode>
  )
}

export const AlertNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='alert_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='alert_input_target' style={{ top: '60px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'RoyalBlue' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Alert
        </Typography>
      </div>
      <div style={{ height: '60px' }}>
        <Typography paddingTop={1} align='center'></Typography>
      </div>
      <Handle type='source' id='alert_source' style={{ top: '15px' }} position={Position.Right} />
    </EventNode>
  )
}

export const VariableNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <div style={{ height: '30px', backgroundColor: 'RoyalBlue' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Variable Name
        </Typography>
      </div>
      <div>
        <Typography paddingTop={1} align='center'>
          {data.value}
        </Typography>
        <Typography fontWeight={'bold'} paddingTop={1} align='center'>
          {data.type}
        </Typography>
      </div>
      <Handle type='source' id='source_execution' style={{ top: '15px' }} position={Position.Right} />
      <Handle type='source' id='source_return' style={{ top: '50px' }} position={Position.Right} />
    </EventNode>
  )
}

export const FunctionNode = ({ id, data, selected }) => {
  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()
  const functionID = data.functionID

  const [parameters, setParameters] = useState([])

  const organizationRef = firebase.firestore().collection('organizations').doc(org_id)
  const applicationRef = organizationRef.collection('applications').doc(app_id)
  const screenRef = applicationRef.collection('screens').doc(screen_id)
  const functionRef = screenRef.collection('functions').doc(functionID)

  useEffect(() => {
    const unsubscribe_parameter = functionRef.collection('parameters').onSnapshot(snapshot => {
      const updatedParameter = snapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() }
      })
      setParameters(updatedParameter)
    })

    return () => {
      unsubscribe_parameter()
    }
  }, [])

  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id={'function_node_target'} style={{ top: '15px' }} position={Position.Left} />
      {parameters?.map((param, index) => (
        <Handle type='target' key={index} id={param.id} style={{ top: `${40 + index * 22}px` }} position={Position.Left} />
      ))}
      <div style={{ height: '30px', backgroundColor: 'RoyalBlue' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          {data.value}
        </Typography>
      </div>
      <div>
        {parameters.map((param, index) => (
          <Typography key={index} marginLeft={1} fontWeight={'bold'} marginRight={1} align='left'>
            {param.name}
          </Typography>
        ))}
      </div>
      <Handle type='source' id='source_execution' style={{ top: '15px' }} position={Position.Right} />
      {(!!parameters.length) && <Handle type='target' id='target_output_pin' style={{ top: `${40 + (parameters.length - 1) * 11}px` }} position={Position.Right} />}
    </EventNode>
  )
}

export const ParameterNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <div style={{ height: '30px', backgroundColor: 'RoyalBlue' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Variable Name
        </Typography>
      </div>
      <div style={{ height: '40px' }}>
        <Typography paddingTop={1} align='center'>
          {data.value}
        </Typography>
      </div>
      <Handle type='source' id='source_execution' style={{ top: '15px' }} position={Position.Right} />
      <Handle type='source' id='source_return' style={{ top: '50px' }} position={Position.Right} />
    </EventNode>
  )
}

export const SetValueNode = ({ id, data, selected }) => {
  const dispatch = useDispatch()
  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()

  const [value, setValue] = useState(data.value)

  const handleValueUpdate = () => {
    if (data.nodeType === 'functionNode') {
      dispatch(
        updateFunctionSetValueNode(org_id, app_id, screen_id, data.functionID, id, value, () => {
          toast.success('Setted the variable value')
        })
      )
    } else {
      dispatch(
        updateSetValueNode(org_id, app_id, screen_id, id, value, () => {
          toast.success('Setted the variable value')
        })
      )
    }
  }

  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='variable_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='variable_input_target' style={{ top: '60px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'RoyalBlue' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Set Value
        </Typography>
      </div>
      <div style={{ padding: '10px' }}>
        <input value={value} style={{ width: '100%' }} onChange={e => setValue(e.target.value)}></input>
        <button style={{ marginTop: '10px', width: '100%' }} onClick={handleValueUpdate}>
          Update
        </button>
      </div>
      <Handle type='source' id='variable_source' style={{ top: '15px' }} position={Position.Right} />
      <Handle type='source' id='variable_output_source' style={{ top: '60px' }} position={Position.Right} />
    </EventNode>
  )
}

export const OperatorNode = ({ id, data, selected }) => {
  const dispatch = useDispatch()

  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()

  const [symbol, setSymbol] = useState(data.value)

  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='operator_execution_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='operator_input1_target' style={{ top: '40px' }} position={Position.Left} />
      <Handle type='target' id='operator_input2_target' style={{ top: '70px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'Pink' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Operator
        </Typography>
      </div>
      <div style={{ padding: '10px' }}>
        <select
          value={symbol}
          onChange={e => {
            setSymbol(e.target.value)
            if (e.target.value !== '') {
              if (data.nodeType === 'functionNode') {
                dispatch(
                  updateFunctionOperatorNode(org_id, app_id, screen_id, data.functionID, id, e.target.value, () =>
                    toast.success('Updated the Operator Symbol')
                  )
                )
              } else {
                dispatch(
                  updateOperatorNode(org_id, app_id, screen_id, id, e.target.value, () => toast.success('Updated the Operator Symbol'))
                )
              }
            }
          }}
          style={{ width: '100%', height: '30px', border: 'solid', borderWidth: 1, borderRadius: 5 }}
        >
          <option value={'addition'}>{'+'}</option>
          <option value={'subtract'}>{'-'}</option>
          <option value={'multiple'}>{'x'}</option>
          <option value={'divide'}>{'/'}</option>
        </select>
      </div>
      <Handle type='source' id='operator_output_source' style={{ top: '55px' }} position={Position.Right} />
    </EventNode>
  )
}

export const FileWriteNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        height: '90px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='file_write_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='file_write_path_target' style={{ top: '50px' }} position={Position.Left} />
      <Handle type='target' id='file_write_data_target' style={{ top: '72px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'Orange' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          File Write
        </Typography>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '10px', width: '50%', height: '60px' }}>
          <Typography align='left'>File Path</Typography>
          <Typography align='left'>File Data</Typography>
        </div>
      </div>
      <Handle type='source' id='filewrite_source' style={{ top: '15px' }} position={Position.Right} />
    </EventNode>
  )
}

export const FileReadNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='file_read_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='file_read_path_target' style={{ top: '50px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'Orange' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          File Read
        </Typography>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ padding: '10px' }}>
          <Typography align='left'>File Path</Typography>
        </div>
        <div style={{ padding: '10px' }}>
          <Typography align='left'>Data</Typography>
        </div>
      </div>
      <Handle type='source' id='file_read_source' style={{ top: '15px' }} position={Position.Right} />
      <Handle type='source' id='file_read_data_target' style={{ top: '50px' }} position={Position.Right} />
    </EventNode>
  )
}

export const DatabaseWriteNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        height: '110px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='fileread_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='databasewrite_path_target' style={{ top: '50px' }} position={Position.Left} />
      <Handle type='target' id='databasewrite_data_target' style={{ top: '72px' }} position={Position.Left} />
      <Handle type='target' id='databasewrite_type_target' style={{ top: '95px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'Orange' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Database Write
        </Typography>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '10px' }}>
          <Typography align='left'>Database Path</Typography>
          <Typography align='left'>Database Data</Typography>
          <Typography align='left'>Database Type</Typography>
        </div>
      </div>
      <Handle type='source' id='databasewrite_source' style={{ top: '15px' }} position={Position.Right} />
    </EventNode>
  )
}

export const DatabaseReadNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='databaseread_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='databaseread_path_target' style={{ top: '50px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'Orange' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Database Read
        </Typography>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ padding: '10px' }}>
          <Typography align='left'>Database Path</Typography>
        </div>
        <div style={{ padding: '10px' }}>
          <Typography align='right'>Data</Typography>
        </div>
      </div>
      <Handle type='source' id='databaseread_source' style={{ top: '15px' }} position={Position.Right} />
      <Handle type='source' id='databaseread_data_source' style={{ top: '50px' }} position={Position.Right} />
    </EventNode>
  )
}

export const LoopNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='loop_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='loop_array_target' style={{ top: '61px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'Orange' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Loop
        </Typography>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ padding: '10px' }}>
          <Typography align='left' marginTop={1}>
            Array
          </Typography>
        </div>
        <div style={{ padding: '10px' }}>
          <Typography align='right'>Element</Typography>
          <Typography align='right'>Completd</Typography>
        </div>
      </div>
      <Handle type='source' id='loop_source' style={{ top: '15px' }} position={Position.Right} />
      <Handle type='source' id='loop_element_source' style={{ top: '50px' }} position={Position.Right} />
      <Handle type='source' id='loop_completed_source' style={{ top: '72px' }} position={Position.Right} />
    </EventNode>
  )
}

export const HTTPResponseNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='loop_target' style={{ top: '15px' }} position={Position.Left} />
      <Handle type='target' id='response_code_target' style={{ top: '60px' }} position={Position.Left} />
      <Handle type='target' id='response_data_target' style={{ top: '89px' }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'Orange' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          HTTP Response
        </Typography>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ padding: '10px' }}>
          <Typography align='left' marginTop={1}>
            Response Code
          </Typography>
          <Typography align='left' marginTop={1}>
            Response Data
          </Typography>
        </div>
      </div>
      <Handle type='source' id='response_source' style={{ top: '15px' }} position={Position.Right} />
    </EventNode>
  )
}

export const FunctionEntryNode = ({ id, data, selected }) => {
  const app_id = useParams().id
  const { org_id } = useParams()
  const { screen_id } = useParams()
  const functionID = data.functionID

  const [parameters, setParameters] = useState([])

  const organizationRef = firebase.firestore().collection('organizations').doc(org_id)
  const applicationRef = organizationRef.collection('applications').doc(app_id)
  const screenRef = applicationRef.collection('screens').doc(screen_id)
  const functionRef = screenRef.collection('functions').doc(functionID)

  useEffect(() => {
    const unsubscribe_parameter = functionRef.collection('parameters').onSnapshot(snapshot => {
      const updatedParameter = snapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() }
      })

      setParameters(updatedParameter)
    })


    return () => {
      unsubscribe_parameter()
    }
  }, [])

  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <div style={{ height: '30px', backgroundColor: 'Orange' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Function Entry
        </Typography>
      </div>
      <div>
        {parameters?.map((param, index) => (
          <Typography key={index} fontWeight={'bold'} marginRight={1} align='right'>
            {param.name}
          </Typography>
        ))}
      </div>
      <Handle type='source' id='function_entry_source' style={{ top: 15 }} position={Position.Right} />
      {parameters?.map((param, index) => (
        <Handle type='source' key={index} id={param.id} style={{ top: `${40 + index * 22}px` }} position={Position.Right} />
      ))}
    </EventNode>
  )
}

export const FunctionReturnNode = ({ id, data, selected }) => {
  return (
    <EventNode
      selected={selected}
      style={{
        width: '200px',
        boxShadow: `${
          !selected
            ? '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)'
            : '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        }`
      }}
    >
      <Handle type='target' id='function_return_target' style={{ top: 15 }} position={Position.Left} />
      <Handle type='target' id='function_return_value_source' style={{ top: 40 }} position={Position.Left} />
      <div style={{ height: '30px', backgroundColor: 'Orange' }}>
        <Typography align='center' fontWeight={'bold'} fontSize={18}>
          Function Return
        </Typography>
      </div>
      <div>
        <Typography align='left' marginLeft={1}>
          Return Value
        </Typography>
      </div>
    </EventNode>
  )
}
