import { toast } from 'react-toastify'
import firebase from '../../config/firebase'

export const updateFunctionStepDetail = (org_id, app_id, screen_id, functionID, node_id, value, code, onSuccess) => async dispatch => {
  try {
    // dispatch({
    //   type: 'APP_LOADING_TRUE'
    // })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id)
    const applicationRef = await organizationRef.collection('applications').doc(app_id)
    const screenRef = await applicationRef.collection('screens').doc(screen_id)
    const functionRef = await screenRef.collection('functions').doc(functionID)

    await functionRef
      .collection('graph')
      .doc(node_id)
      .update({
        code: code,
        value: value
      })
      .then(() => {
        onSuccess()
      })
      .catch(error => toast.error(error.message))

    // dispatch({
    //   type: 'APP_LOADING_FALSE'
    // })
  } catch (error) {
    toast.error(error.message)

    // dispatch({
    //   type: 'APP_LOADING_FALSE'
    // })
  }
}

export const getFunctionNodeDetail = (org_id, app_id, screen_id, functionID, node_id, onSuccess) => async dispatch => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id)
    const applicationRef = await organizationRef.collection('applications').doc(app_id)
    const screenRef = await applicationRef.collection('screens').doc(screen_id)
    const functionRef = await screenRef.collection('functions').doc(functionID)

    await functionRef
      .collection('graph')
      .doc(node_id)
      .get()
      .then(doc => {
        onSuccess(doc.data())
      })
      .catch(error => toast.error(error.message))

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  } catch (error) {
    toast.error(error.message)

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  }
}

export const updateFunctionInvokeEvent = (org_id, app_id, screen_id, functionID, id, custom_event_id) => async dispatch => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id)
    const applicationRef = await organizationRef.collection('applications').doc(app_id)
    const screenRef = await applicationRef.collection('screens').doc(screen_id)
    const functionRef = await screenRef.collection('functions').doc(functionID)

    await functionRef
      .collection('graph')
      .doc(id)
      .update({
        value: custom_event_id
      })
      .then(() => {
        toast.success('Updated')
      })
      .catch(error => toast.error(error.message))

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  } catch (error) {
    toast.error(error.message)

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  }
}

export const updateFunctionConstantNode = (org_id, app_id, screen_id, functionID, node_id, value, onSuccess) => async dispatch => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id)
    const applicationRef = await organizationRef.collection('applications').doc(app_id)
    const screenRef = await applicationRef.collection('screens').doc(screen_id)
    const functionRef = await screenRef.collection('functions').doc(functionID)

    await functionRef
      .collection('graph')
      .doc(node_id)
      .update({
        value: value
      })
      .then(() => {
        onSuccess()
      })
      .catch(error => toast.error(error.message))

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  } catch (error) {
    toast.error(error.message)

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  }
}

export const updateFunctionComparisonNode = (org_id, app_id, screen_id, functionID, node_id, value, onSuccess) => async dispatch => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id)
    const applicationRef = await organizationRef.collection('applications').doc(app_id)
    const screenRef = await applicationRef.collection('screens').doc(screen_id)
    const functionRef = await screenRef.collection('functions').doc(functionID)

    await functionRef
      .collection('graph')
      .doc(node_id)
      .update({
        value: value
      })
      .then(() => {
        onSuccess()
      })
      .catch(error => toast.error(error.message))

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  } catch (error) {
    toast.error(error.message)

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  }
}

export const updateFunctionSetValueNode = (org_id, app_id, screen_id, functionID, node_id, value, onSuccess) => async dispatch => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id)
    const applicationRef = await organizationRef.collection('applications').doc(app_id)
    const screenRef = await applicationRef.collection('screens').doc(screen_id)
    const functionRef = await screenRef.collection('functions').doc(functionID)

    await functionRef
      .collection('graph')
      .doc(node_id)
      .update({
        value
      })
      .then(() => {
        onSuccess()
      })
      .catch(error => toast.error(error.message))

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  } catch (error) {
    toast.error(error.message)

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  }
}

export const updateFunctionOperatorNode = (org_id, app_id, screen_id, functionID, node_id, value, onSuccess) => async dispatch => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id)
    const applicationRef = await organizationRef.collection('applications').doc(app_id)
    const screenRef = await applicationRef.collection('screens').doc(screen_id)
    const functionRef = await screenRef.collection('functions').doc(functionID)

    await functionRef
      .collection('graph')
      .doc(node_id)
      .update({
        value: value
      })
      .then(() => {
        onSuccess()
      })
      .catch(error => toast.error(error.message))

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  } catch (error) {
    toast.error(error.message)

    dispatch({
      type: 'APP_LOADING_FALSE'
    })
  }
}
