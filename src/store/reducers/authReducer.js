const initState = {
  uid: '',
  registered: false,
  organizationID: '',
  user: {},
  loading: false,
  invitedInfo: {},
  styleMode: 'light',
  sideBar: true
}
const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        uid: action.user?.id,
        user: { ...action.user }
      }
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        uid: '',
        user: {}
      }
    case 'LOADING_TRUE':
      return {
        ...state,
        loading: true
      }
    case 'LOADING_FALSE':
      return {
        ...state,
        loading: false
      }
    case 'UPDATE_STYLE_MODE':
      return {
        ...state,
        styleMode: action.payload
      }
    case 'GET_INVITED_EMAIL':
      return {
        ...state,
        invitedInfo: action.payload
      }
    case 'VARIABLE_SIDEBAR':
      return {
        ...state,
        sideBar: action.payload
      }
    case 'SELECT_ORGANIZATION':
      return {
        ...state,
        organizationID: action.payload
      }
    default:
      return {
        ...state
      }
  }
}
export default authReducer
