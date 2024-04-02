import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user : null,
    token : null
  },
  reducers: {
    setUser: (state , {payload}) => {
        state.user = payload.user
        state.token = payload.token
    },
  }
})


export const { setUser } = authSlice.actions

export default authSlice.reducer