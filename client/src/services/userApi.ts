import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use the same API URL configuration as taskApi
const API_URL = process.env.API_URL || 'http://localhost:9000/api';

// Debug log to identify what URL is being used
console.log('userApi.ts - Using API URL for auth:', API_URL);

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL, 
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Add any custom headers needed for CORS
      headers.set('Content-Type', 'application/json');
      
      // Log the request URL for debugging
      console.log('Making auth API request with URL:', API_URL);
      
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
      query: (body) => {
        console.log('Logging in with URL:', `${API_URL}/auth/login`);
        return {
          url: "/auth/login",
          method: "POST",
          body,
        };
      },
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
