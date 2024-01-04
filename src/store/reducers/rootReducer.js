import { combineReducers } from 'redux'
import authReducer from './authReducer'
import apiReducer from './apiReducer'
import applicationReducer from './applicationReducer'
import mainmenuReducer from './mainmenuReducer'
import notificationReducer from './notificationReducer'
import loadingReducer from './loadingReducer'
import menu from './menu'
import storageReducer from './storageReducer'
import databaseReducer from './databaseReducer'

const rootReducer = combineReducers({
  mainmenu: mainmenuReducer,
  auth: authReducer,
  API: apiReducer,
  Application: applicationReducer,
  storage: storageReducer,
  notification: notificationReducer,
  menu: menu,
  loading: loadingReducer,
  database: databaseReducer,
})
export default rootReducer
