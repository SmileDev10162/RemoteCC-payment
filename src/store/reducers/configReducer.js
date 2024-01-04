const initState = {
  allConfig: null,
  loading: false
}
const configReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_CONFIG':
      return {
        ...state,
        allConfig: action.payload
      }
    case 'CONFIG_LOADING_TRUE':
      return {
        ...state,
        loading: true
      }
    case 'CONFIG_LOADING_FALSE':
      return {
        ...state,
        loading: false
      }
    default:
      return {
        ...state
      }
  }
}
export default configReducer
