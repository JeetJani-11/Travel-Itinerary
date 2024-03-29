import { createSlice } from '@reduxjs/toolkit'

export const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    trip : null
  },
  reducers: {
    
    setTrip: (state , {payload}) => {
        state.trip = payload
    },
  }
})


export const { setTrip } = tripSlice.actions

export default tripSlice.reducer