import { Position } from 'reactflow'

export const DefaultEvent = {
  id: 'defaultEvent',
  type: 'defaultEventNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 150
  },
  data: {
    label: 'On Start',
    nodeType: ''
  },
  position: { x: 100, y: 100 },
  sourcePosition: Position.Right
}

export const CustomEvent = {
  id: 'customEvent',
  type: 'customEventNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 150
  },
  data: {
    label: 'Custom',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  sourcePosition: Position.Right
}

export const Step = {
  id: 'step',
  type: 'stepNode',
  style: {
    width: 200
  },
  data: {
    label: 'Step',
    value: '',
    code: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const InvokeEvent = {
  id: 'invokeEvent',
  type: 'invokeNode',
  style: {
    background: '#ffffff',
    width: 200
  },
  data: {
    label: 'Invoke Event',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const ConstantNumber = {
  id: 'constantNumber',
  type: 'constantNumberNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 150
  },
  data: {
    label: 'Constant Number',
    value: 0,
    nodeType: ''
  },
  position: { x: 100, y: 100 },
  sourcePosition: Position.Right
}

export const ConstantString = {
  id: 'constantString',
  type: 'constantStringNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 150
  },
  data: {
    label: 'Constant String',
    value: '',
    nodeType: ''
  },
  position: { x: 100, y: 100 },
  sourcePosition: Position.Right
}

export const ConstantBoolean = {
  id: 'constantBooleanNode',
  type: 'constantBooleanNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 150
  },
  data: {
    label: 'Constant Boolean',
    value: '',
    nodeType: ''
  },
  position: { x: 100, y: 100 },
  sourcePosition: Position.Right
}

export const Comparison = {
  id: 'comparisonNode',
  type: 'comparisonNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Comparison Node',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const Condition = {
  id: 'conditionNode',
  type: 'conditionNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Condition Node',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const Print = {
  id: 'printNode',
  type: 'printNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Print',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left
}

export const Alert = {
  id: 'alertNode',
  type: 'alertNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Alert',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left
}

export const Variable = {
  id: 'variableNode',
  type: 'variableNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200,
    nodeType: ''
  },
  data: {
    label: 'Variable Name',
    value: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Right
}

export const FunctionN = {
  id: 'functionNode',
  type: 'functionNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'function Name',
    value: '',
    type: '',
    parameters: [],
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Right
}

export const OnRequest = {
  id: 'onRequestNode',
  type: 'onRequestNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'OnRequest',
    value: '',
    parameters: [],
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Right
}

export const SetValue = {
  id: 'setValueNode',
  type: 'setValueNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'SetValue',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const Operator = {
  id: 'operatorNode',
  type: 'operatorNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Operator Node',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const FileWrite = {
  id: 'fileWriteNode',
  type: 'fileWriteNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'File Write Node',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const FileRead = {
  id: 'fileReadNode',
  type: 'fileReadNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'File Read Node',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const DatabaseWrite = {
  id: 'databaseWriteNode',
  type: 'databaseWriteNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Databse Write Node',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const DatabaseRead = {
  id: 'databaseReadNode',
  type: 'databaseReadNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Database Read Node',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const Loop = {
  id: 'loopNode',
  type: 'loopNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Loop Node',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const HTTPResponse = {
  id: 'httpResponseNode',
  type: 'httpResponseNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'HTTP Response',
    value: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const FunctionEntry = {
  id: 'functionEntryNode',
  type: 'functionEntryNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Function Entry',
    value: '',
    parameters: [],
    functionID: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}

export const FunctionReturn = {
  id: 'functionReturnNode',
  type: 'functionReturnNode',
  style: {
    background: '#ffffff',
    color: 'white',
    width: 200
  },
  data: {
    label: 'Function Return',
    value: '',
    functionID: '',
    nodeType: ''
  },
  position: { x: 0, y: 0 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right
}
