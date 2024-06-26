import { createSlice } from "@reduxjs/toolkit";

export const tripSlice = createSlice({
  name: "trip",
  initialState: {
    trip: null,
  },
  reducers: {
    setTrip: (state, { payload }) => {
      state.trip = payload;
    },
    addPlace: (state, { payload }) => {
      state.trip.places.push(payload);
    },
    removePlace: (state, { payload }) => {
      state.trip.places = state.trip.places.filter(
        (place) => place.place.id !== payload
      );
    },
    addNote: (state, { payload }) => {
      console.log(payload)
      state.trip.notes.push(payload.text);
    },
    removeNote: (state, { payload }) => {
      state.trip.notes = state.trip.notes.filter((note) => note !== payload);
    },
  },
});

export const { setTrip, addPlace, removePlace  , addNote , removeNote} = tripSlice.actions;

export default tripSlice.reducer;
