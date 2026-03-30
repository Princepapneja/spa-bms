import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../utils/basequery";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: (params) => ({
        url: "/bookings/outlet/booking/list",
        method: "GET",
        params,
      }),
    }),
    createBooking: builder.mutation({
      query: (data) => ({
        url: "/bookings/create",  
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  useGetBookingsQuery,
  useCreateBookingMutation
} = bookingApi;