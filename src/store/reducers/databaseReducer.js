

const initState = {
    rootCollections: []
  }
  const databaseReducer = (state = initState, action) => {
    switch (action.type) {
      case 'GET_COLLECTION':
        return {
          ...state,
          rootCollections: action.payload
        }
      default:
        return {
          ...state
        }
    }
  }
  export default databaseReducer
  