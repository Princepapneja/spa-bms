// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     token : null,
//     isAuthenticated: false,
//     user:null
//   },
//   reducers: {
//     setSession: (state, action) => {
//       state.token = action.payload.token;
//       state.user = action.payload?.user;

//       state.isAuthenticated = !!action.payload;
//       localStorage.setItem("user",JSON.stringify(action.payload?.user))
//           localStorage.setItem("token", action.payload?.token);
      
//     },
//     clearSession: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//     refreshSession:(state) => {
//       state.user = JSON.parse(localStorage.getItem("user")|| "")|| null;
//       state.isAuthenticated = true;
//     },
//   },
// });

// export const { setSession, clearSession,refreshSession } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.token = action.payload?.token || null;
      state.user = action.payload?.user || null;
      state.isAuthenticated = !!action.payload?.token;
    },

    clearSession: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },

   
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
