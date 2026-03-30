import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../utils/basequery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: "/me", 
        method: "GET",
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,        
} = authApi;