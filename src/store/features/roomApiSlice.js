

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../utils/basequery";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getRoomBookings: builder.query({
      query: (params) => ({
        url: "/room-bookings/outlet/1",
        method: "GET",
        params,
      }),
    }),

  }),
});

export const {
  useGetRoomBookingsQuery,
} = roomApi;