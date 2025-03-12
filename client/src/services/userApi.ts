import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use the same API URL configuration as taskApi
const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Debug log to identify what URL is being used
console.log('userApi.ts - Using API URL for auth:', API_URL);

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL, 
    credentials: "include",
    // Log requests to help debug API connection issues
    prepareHeaders: (headers, { getState }) => {
      console.log(`Making auth API request to ${API_URL}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
    getUser: builder.query({
      query: () => "/auth/user",
    }),
    
  }),
});

export const {
  useGetUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} = userApi;
