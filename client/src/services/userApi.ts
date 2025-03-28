import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use the same API URL configuration as taskApi
const API_URL = 'http://46.202.162.244:9000/api';

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL, 
    credentials: "include",
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
