import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../utils/basequery";

export const customerApiSlice = createApi({
  reducerPath: "customerApiSlice",
  baseQuery: baseQuery,
  endpoints: (builder) => ({

    // 📅 GET BOOKINGS
    getUsers: builder.query({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
    }),

  }),
});

export const {
  useGetUsersQuery,
} = customerApiSlice;