const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  user: null,
};

const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = globalSlice.actions;
export const globalReducer = globalSlice.reducer;
