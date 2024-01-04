import { toast } from 'react-toastify'
import firebase from '../../config/firebase'
import axios from 'axios'

const URL = 'http://127.0.0.1:5001/remotecc-ccb45/us-central1/app'

export const getBuckets = uid => async dispatch => {
  try {
    dispatch({
      type: 'LOADING_TRUE'
    })

    const body = {}

    axios
      .post(`${URL}/aws/get-bucket`, body)
      .then(res => {
        
        if (res.data?.success) {
          const bucketData = res.data?.message?.Contents.map((content) => {
            return {
              key: content.Key,
              modified: new Date(content.LastModified),
              size: content.Size
            }
          })
          dispatch({
            type: 'GET_BUCKET',
            payload: bucketData
          })

          console.log("res-getbucket", bucketData)
          
        }

      })
      .catch(error => console.log(error))

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
