import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState()?.auth?.token || localStorage.getItem("token");
        
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
        
    },

})