import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import tripsSlice from './tripsSlice'
import tripSlice from './tripSlice'

export default configureStore({
  reducer: {
    'auth': authReducer,
    'trips': tripsSlice,
    'trip': tripSlice
  }
})