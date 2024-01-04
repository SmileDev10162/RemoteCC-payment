import { toast } from 'react-toastify'
import firebase from '../../config/firebase'

export const deactiveConfig = (org_id, id, onSuccess) => async dispatch => {
  try {
    dispatch({
      type: 'CONFIG_LOADING_TRUE'
    })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id)

    await organizationRef
      .collection('configurations')
      .doc(id)
      .update({
        status: false,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => onSuccess())
      .catch(error => toast.error(error.message))

    dispatch({
      type: 'CONFIG_LOADING_FALSE'
    })
  } catch (error) {
    toast.error(error.message)

    dispatch({
      type: 'CONFIG_LOADING_FALSE'
    })
  }
}
