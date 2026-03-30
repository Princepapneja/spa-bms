import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from "./features/authApiSlice";
import { therapistApi } from "./features/therapistSlice";

import authReducer from "./authSlice";
import { bookingApi } from "./features/bookingApiSlice";
import { outletTimingApi } from "./features/outletTimingApiSlice";
import { customerApiSlice } from "./features/customersApiSlice";
import { serviceApi } from "./features/serviceApiSlice";
import { roomApi } from "./features/roomApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [therapistApi.reducerPath]: therapistApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [outletTimingApi.reducerPath]: outletTimingApi.reducer,
    [customerApiSlice.reducerPath]: customerApiSlice.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      therapistApi.middleware,
      bookingApi.middleware,
      outletTimingApi.middleware,
      customerApiSlice.middleware,
      serviceApi.middleware,
      roomApi.middleware,
    ),
});

setupListeners(store.dispatch);