import firebase from 'firebase/app'
// import firebase from 'firebase';
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyADzi39WVio2LP0KyO-fYfZEclBnsvfdDo',
  authDomain: 'remotecc-ccb45.firebaseapp.com',
  databaseURL: 'https://remotecc-ccb45-default-rtdb.firebaseio.com',
  projectId: 'remotecc-ccb45',
  storageBucket: 'remotecc-ccb45.appspot.com',
  messagingSenderId: '96888024643',
  appId: '1:96888024643:web:640354c85857b65f012ef6',
  measurementId: 'G-BTCWL0M79K'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export const db = firebase.firestore()
export const storage = firebase.storage()
export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider()

export default firebase
