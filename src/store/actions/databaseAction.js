import { toast } from 'react-toastify'
import firebase from '../../config/firebase'


export const getRootCollections = uid => async dispatch => {
    try {
      dispatch({
        type: 'LOADING_TRUE'
      })
      
      
      dispatch({
        type: 'LOADING_FALSE'
      })
    } catch (error) {
      toast.error(error.message)
  
      dispatch({
        type: 'LOADING_FALSE'
      })
    }
  }
  