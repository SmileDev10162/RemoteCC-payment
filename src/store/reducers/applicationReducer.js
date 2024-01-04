const initState = {
  allAPP: null,
  customEvents: null,
  variables: null,
  functions: null,
  parameters: null,
  loading: false,
  nodes: {},
  edges: {},
  property: null
}
const applicationReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_APP':
      return {
        ...state,
        allAPP: action.payload
      }
    case 'APP_LOADING_TRUE':
      return {
        ...state,
        loading: true
      }
    case 'APP_LOADING_FALSE':
      return {
        ...state,
        loading: false
      }
    case 'GET_CUSTOM_EVENT':
      return {
        ...state,
        customEvents: action.payload
      }
    case 'GET_ALL_VARIABLES':
      return {
        ...state,
        variables: action.payload
      }
    case 'GET_ALL_FUNCTIONS':
      return {
        ...state,
        functions: action.payload
      }
    case 'GET_ALL_PARAMETERS':
      return {
        ...state,
        parameters: action.payload
      }
    case 'CURRENT_APP_NODES':
      return {
        ...state,
        nodes: action.payload.nodes
      }
    case 'CURRENT_APP_EDGES':
      return {
        ...state,
        edges: action.payload.edges
      }
    case 'GET_PROPERTY':
      return {
        ...state,
        property: action.payload
      }
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        property: { ...state.property, ...action.payload }
      }
    default:
      return {
        ...state
      }
  }
}
export default applicationReducer
