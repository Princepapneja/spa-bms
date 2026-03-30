
// {{BASE_URL}}/api/v1/service-category?outlet_type=2&outlet=1&pagination=0&panel=outlet
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../utils/basequery";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getServiceCategories: builder.query({
      query: (params) => ({
        url: "/service-category",
        method: "GET",
        params,
      }),
    }),

  }),
});

export const {
  useGetServiceCategoriesQuery,
} = serviceApi;