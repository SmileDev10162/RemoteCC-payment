const initState = {
  buckets: []
}
const storageReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GET_BUCKET':
      return {
        ...state,
        buckets: action.payload
      }
    default:
      return {
        ...state
      }
  }
}
export default storageReducer
