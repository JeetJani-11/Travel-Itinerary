import { createSlice } from '@reduxjs/toolkit'

export const tripsSlice = createSlice({
  name: 'trips',
  initialState: {
    trips : []
  },
  reducers: {
    addTrip: (state , {payload}) => {
        state.trips.push(payload)
    },
    setTrips: (state , {payload}) => {
        state.trips = payload
    },
  }
})


export const { addTrip , setTrips } = tripsSlice.actions

export default tripsSlice.reducer