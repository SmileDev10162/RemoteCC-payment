import { toast } from 'react-toastify';
import firebase from '../../config/firebase';
import axios from 'axios';

// import admin from "firebase-admin";

// import serviceAccount from "../../config/serviceAccountKey.json";

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://remotecc-ccb45-default-rtdb.firebaseio.com"
// });


const URL = 'http://127.0.0.1:5001/remotecc-ccb45/us-central1/app';

const createNewBucket = async (folderName) => {
  const body = {
    folderName
  };
  
  // const db = admin.firestore();

  // const structure = async function getDataStructure() {
  //   const structure = {};

  //   const rootCollections = await db.listCollections();
  //   for (const collectionRef of rootCollections) {
  //     const collectionName = collectionRef.id;
  //     structure[collectionName] = {};

  //     const documents = await collectionRef.listDocuments();
  //     for (const documentRef of documents) {
  //       const documentSnapshot = await documentRef.get();
  //       const documentData = documentSnapshot.data();
  //       structure[collectionName][documentRef.id] = documentData;
  //     }
  //   }

  //   return structure;
  // }
  // console.log("structure", structure)

  await axios
    .post(`${URL}/aws/create-bucket`, body)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => console.log(error));
};

export const newApplication = (org_id, name, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    // console.log("root list", firebase
    //   .firestore().listCollections())

    await organizationRef
      .collection('applications')
      .add({
        name,
        status: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then((doc) => {
        createNewBucket(doc.id);
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const deactiveApplication = (org_id, id, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);

    await organizationRef
      .collection('applications')
      .doc(id)
      .update({
        status: false,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => onSuccess())
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const addNewNode = (org_id, id, screen_id, newNode, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    let nodeInfo = {};
    if (newNode.nodeType === 'InvokeEvent') {
      nodeInfo = {
        ...newNode
      };
    } else if (newNode.nodeType === 'FunctionNode') {
      nodeInfo = {
        functionID: newNode.id,
        ...newNode
      };
    } else {
      nodeInfo = {
        ...newNode
      };
    }

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('graph')
      .add({
        ...nodeInfo,
        applicationID: id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then((doc) => {
        onSuccess(doc.id);
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const addNewFunctionNode = (org_id, id, screen_id, functionID, newNode, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    let nodeInfo = {};
    if (newNode.nodeType === 'InvokeEvent') {
      nodeInfo = {
        ...newNode
      };
    } else if (newNode.nodeType === 'FunctionNode') {
      nodeInfo = {
        functionID: newNode.id,
        ...newNode
      };
    } else {
      nodeInfo = {
        ...newNode
      };
    }

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);
    const functionRef = await screenRef.collection('functions').doc(functionID);

    await functionRef
      .collection('graph')
      .add({
        ...nodeInfo,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then((doc) => {
        onSuccess(doc.id);
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const updateFunctionGraphPosition = (org_id, id, screen_id, functionID, nodeID, newPosition) => async (dispatch) => {
  try {
    // dispatch({
    //   type: 'APP_LOADING_TRUE'
    // })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);
    const functionRef = await screenRef.collection('functions').doc(functionID);

    await functionRef
      .collection('graph')
      .doc(nodeID)
      .update({
        position: newPosition
      })
      .then(() => {})
      .catch((error) => toast.error(error.message));

    // dispatch({
    //   type: 'APP_LOADING_FALSE'
    // })
  } catch (error) {
    toast.error(error.message);

    // dispatch({
    //   type: 'APP_LOADING_FALSE'
    // })
  }
};

export const deleteFunctionGraphNode = (org_id, id, screen_id, functionID, nodeID, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);
    const functionRef = await screenRef.collection('functions').doc(functionID);

    await functionRef
      .collection('edge')
      .where('source', '==', nodeID)
      .get()
      .then((snapShot) => {
        var batch = firebase.firestore().batch();
        snapShot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      .catch((err) => toast.error(err.message));

    await functionRef
      .collection('edge')
      .where('target', '==', nodeID)
      .get()
      .then((snapShot) => {
        var batch = firebase.firestore().batch();
        snapShot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      .catch((err) => toast.error(err.message));

    await functionRef
      .collection('graph')
      .doc(nodeID)
      .delete()
      .then(() => {
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const deleteFunctionGraphEdge = (org_id, id, screen_id, functionID, edgeID) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);
    const functionRef = await screenRef.collection('functions').doc(functionID);

    await functionRef
      .collection('edge')
      .doc(edgeID)
      .delete()
      .then(() => {})
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const addNewFunctionGraphEdge = (org_id, id, screen_id, functionID, newEdge) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);
    const functionRef = await screenRef.collection('functions').doc(functionID);

    await functionRef
      .collection('edge')
      .add({
        ...newEdge,
        applicationID: id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {})
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const deleteNode = (org_id, id, screen_id, nodeID, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('edge')
      .where('source', '==', nodeID)
      .get()
      .then((snapShot) => {
        var batch = firebase.firestore().batch();
        snapShot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      .catch((err) => toast.error(err.message));

    await screenRef
      .collection('edge')
      .where('target', '==', nodeID)
      .get()
      .then((snapShot) => {
        var batch = firebase.firestore().batch();
        snapShot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      })
      .catch((err) => toast.error(err.message));

    await screenRef
      .collection('graph')
      .doc(nodeID)
      .delete()
      .then(() => {
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const addNewEdge = (org_id, id, screen_id, newEdge) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('edge')
      .add({
        ...newEdge,
        applicationID: id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {})
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const deleteEdge = (org_id, id, screen_id, edgeID) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('edge')
      .doc(edgeID)
      .delete()
      .then(() => {})
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const updatePosition = (org_id, id, screen_id, nodeID, newPosition) => async (dispatch) => {
  try {
    // dispatch({
    //   type: 'APP_LOADING_TRUE'
    // })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('graph')
      .doc(nodeID)
      .update({
        position: newPosition
      })
      .then(() => {})
      .catch((error) => toast.error(error.message));

    // dispatch({
    //   type: 'APP_LOADING_FALSE'
    // })
  } catch (error) {
    toast.error(error.message);

    // dispatch({
    //   type: 'APP_LOADING_FALSE'
    // })
  }
};

export const getCustomEvent = (org_id, app_id) => async (dispatch) => {
  try {
    let allCustomEvents = [];

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);

    const snapShot = await applicationRef.collection('custom_events').get();

    await snapShot.forEach((doc) => {
      allCustomEvents.push({ id: doc.id, ...doc.data() });
    });

    dispatch({
      type: 'GET_CUSTOM_EVENT',
      payload: allCustomEvents
    });
  } catch (error) {
    toast.error(error.message);
  }
};

export const getAllVariables = (org_id, app_id, screen_id) => async (dispatch) => {
  try {
    let allVariables = [];

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    const snapShot = await screenRef.collection('variables').get();

    await snapShot.forEach((doc) => {
      allVariables.push({ id: doc.id, ...doc.data() });
    });

    dispatch({
      type: 'GET_ALL_VARIABLES',
      payload: allVariables
    });
  } catch (error) {
    toast.error(error.message);
  }
};

export const getAllFunctions = (org_id, app_id, screen_id) => async (dispatch) => {
  try {
    let allFunctions = [];

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    const snapShot = await screenRef.collection('functions').get();

    await snapShot.forEach((doc) => {
      allFunctions.push({ id: doc.id, ...doc.data() });
    });

    dispatch({
      type: 'GET_ALL_FUNCTIONS',
      payload: allFunctions
    });
  } catch (error) {
    toast.error(error.message);
  }
};

export const getAllParameters = (org_id, app_id, screen_id) => async (dispatch) => {
  try {
    let allParameter = [];

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    const snapShot = await screenRef.collection('parameters').get();

    await snapShot.forEach((doc) => {
      allParameter.push({ id: doc.id, ...doc.data() });
    });

    dispatch({
      type: 'GET_ALL_PARAMETERS',
      payload: allParameter
    });
  } catch (error) {
    toast.error(error.message);
  }
};

export const getAllFunctionParameters = (org_id, app_id, screen_id) => async (dispatch) => {
  try {
    let allParameter = [];

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);
    const functionRef = await screenRef.collection('functions').doc(functionID);

    const snapShot = await functionRef.collection('parameters').get();

    await snapShot.forEach((doc) => {
      allParameter.push({ id: doc.id, ...doc.data() });
    });

    dispatch({
      type: 'GET_ALL_PARAMETERS',
      payload: allParameter
    });
  } catch (error) {
    toast.error(error.message);
  }
};

export const addCustomEvent = (org_id, app_id, customEvent, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);

    await applicationRef
      .collection('custom_events')
      .add({
        ...customEvent,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => onSuccess())
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });

    dispatch(getCustomEvent(org_id, app_id));
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const addNewVariable = (org_id, app_id, screen_id, variableName, variableType, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('variables')
      .add({
        name: variableName,
        type: variableType,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => onSuccess())
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });

    dispatch(getAllVariables(org_id, app_id, screen_id));
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const addNewFunction = (org_id, app_id, screen_id, functionName, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('functions')
      .add({
        name: functionName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then((doc) => {
        const newEntryNode = {
          nodeType: 'FunctionEntryNode',
          position: {
            x: -150,
            y: 200
          },
          value: 'Entry Node'
        };
        // const newReturnNode = {
        //   nodeType: 'FunctionReturnNode',
        //   position: {
        //     x: -200,
        //     y: 150
        //   },
        //   value: 'Return Node'
        // }

        dispatch(addNewFunctionNode(org_id, app_id, screen_id, doc.id, newEntryNode, () => {}));
        // dispatch(addNewFunctionNode(org_id, app_id, screen_id, doc.id, newReturnNode, () => {}))
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });

    dispatch(getAllFunctions(org_id, app_id, screen_id));
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const addNewParameter =
  (org_id, app_id, screen_id, parameterName, parameterType, parameterDescription, onSuccess) => async (dispatch) => {
    try {
      dispatch({
        type: 'APP_LOADING_TRUE'
      });

      const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
      const applicationRef = await organizationRef.collection('applications').doc(app_id);
      const screenRef = await applicationRef.collection('screens').doc(screen_id);

      await screenRef
        .collection('parameters')
        .add({
          name: parameterName,
          type: parameterType,
          description: parameterDescription,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => onSuccess())
        .catch((error) => toast.error(error.message));

      dispatch({
        type: 'APP_LOADING_FALSE'
      });

      dispatch(getAllParameters(org_id, app_id, screen_id));
    } catch (error) {
      toast.error(error.message);

      dispatch({
        type: 'APP_LOADING_FALSE'
      });
    }
  };

export const addNewFunctionParameter =
  (org_id, app_id, screen_id, functionID, parameterName, parameterType, parameterDescription, onSuccess) => async (dispatch) => {
    try {
      dispatch({
        type: 'APP_LOADING_TRUE'
      });

      const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
      const applicationRef = await organizationRef.collection('applications').doc(app_id);
      const screenRef = await applicationRef.collection('screens').doc(screen_id);
      const functionRef = await screenRef.collection('functions').doc(functionID);

      await functionRef
        .collection('parameters')
        .add({
          name: parameterName,
          type: parameterType,
          description: parameterDescription,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => onSuccess())
        .catch((error) => toast.error(error.message));

      dispatch({
        type: 'APP_LOADING_FALSE'
      });

      dispatch(getAllParameters(org_id, app_id, screen_id, functionID));
    } catch (error) {
      toast.error(error.message);

      dispatch({
        type: 'APP_LOADING_FALSE'
      });
    }
  };

export const deleteVariable = (org_id, app_id, screen_id, var_id, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('variables')
      .doc(var_id)
      .delete()
      .then(() => onSuccess())
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });

    dispatch(getAllVariables(org_id, app_id));
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const deleteFunction = (org_id, app_id, screen_id, func_id, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('functions')
      .doc(func_id)
      .delete()
      .then(() => {
        screenRef
          .collection('graph')
          .where('functionID', '==', func_id)
          .get()
          .then((snapshot) => {
            var batch = firebase.firestore().batch();
            snapshot.forEach((doc) => {
              batch.delete(doc.ref);
            });
            return batch.commit();
          });

        screenRef
          .collection('edge')
          .where('source', '==', func_id)
          .get()
          .then((snapshot) => {
            var batch = firebase.firestore().batch();
            snapshot.forEach((doc) => {
              batch.delete(doc.ref);
            });
            return batch.commit();
          });

        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });

    dispatch(getAllFunctions(org_id, app_id, screen_id));
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const deleteParameter = (org_id, app_id, screen_id, param_id, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('parameters')
      .doc(param_id)
      .delete()
      .then(() => onSuccess())
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });

    dispatch(getAllParameters(org_id, app_id, screen_id));
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const deleteFunctionParameter = (org_id, app_id, screen_id, functionID, param_id, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);
    const functionRef = await screenRef.collection('functions').doc(functionID);

    await functionRef
      .collection('parameters')
      .doc(param_id)
      .delete()
      .then(() => onSuccess())
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });

    dispatch(getAllParameters(org_id, app_id, functionID));
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const updateStepDetail = (org_id, app_id, screen_id, node_id, value, code, onSuccess) => async (dispatch) => {
  try {
    // dispatch({
    //   type: 'APP_LOADING_TRUE'
    // })

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('graph')
      .doc(node_id)
      .update({
        code: code,
        value: value
      })
      .then(() => {
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    // dispatch({
    //   type: 'APP_LOADING_FALSE'
    // })
  } catch (error) {
    toast.error(error.message);

    // dispatch({
    //   type: 'APP_LOADING_FALSE'
    // })
  }
};

export const getFunctionDetail = (org_id, app_id, screen_id, node_id, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('graph')
      .doc(node_id)
      .get()
      .then((doc) => {
        onSuccess(doc.data());
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const updateInvokeEvent = (org_id, app_id, screen_id, id, custom_event_id) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('graph')
      .doc(id)
      .update({
        value: custom_event_id
      })
      .then(() => {
        toast.success('Updated');
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const updateConstantNode = (org_id, app_id, screen_id, node_id, value, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('graph')
      .doc(node_id)
      .update({
        value: value
      })
      .then(() => {
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const updateComparisonNode = (org_id, app_id, screen_id, node_id, value, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('graph')
      .doc(node_id)
      .update({
        value: value
      })
      .then(() => {
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const updateSetValueNode = (org_id, app_id, screen_id, node_id, value, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('graph')
      .doc(node_id)
      .update({
        value
      })
      .then(() => {
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const updateOperatorNode = (org_id, app_id, screen_id, node_id, value, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    const screenRef = await applicationRef.collection('screens').doc(screen_id);

    await screenRef
      .collection('graph')
      .doc(node_id)
      .update({
        value: value
      })
      .then(() => {
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    toast.error(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const savePropertyOfScreen = (org_id, app_id, screen_id, property, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    await applicationRef
      .collection('screens')
      .doc(screen_id)
      .update({
        ...property,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        // dispatch({
        //   type: 'UPDATE_PROPERTY',
        //   payload: {
        //     ...doc.data(),
        //     createdAt: firebase.firestore.FieldValue.serverTimestamp()
        //   }
        // })
        onSuccess();
      })
      .catch((error) => console.log(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    console.log(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const getProperty = (org_id, app_id, screen_id, onSuccess) => async (dispatch) => {
  try {
    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    await applicationRef
      .collection('screens')
      .doc(screen_id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          onSuccess(doc.data());
        } else {
          dispatch({
            type: 'GET_PROPERTY',
            payload: {}
          });
        }
      })
      .catch((error) => console.log(error.message));
  } catch (error) {
    console.log(error.message);
  }
};

export const saveNewEndpoint = (org_id, app_id, newEndpoint, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    await applicationRef
      .collection('screens')
      .add({
        ...newEndpoint,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        onSuccess();
      })
      .catch((error) => console.log(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    console.log(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};

export const deleteEndpoint = (org_id, app_id, endpoint_id, onSuccess) => async (dispatch) => {
  try {
    dispatch({
      type: 'APP_LOADING_TRUE'
    });

    const organizationRef = await firebase.firestore().collection('organizations').doc(org_id);
    const applicationRef = await organizationRef.collection('applications').doc(app_id);
    await applicationRef
      .collection('screens')
      .doc(endpoint_id)
      .delete()
      .then(() => {
        onSuccess();
      })
      .catch((error) => toast.error(error.message));

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  } catch (error) {
    console.log(error.message);

    dispatch({
      type: 'APP_LOADING_FALSE'
    });
  }
};
