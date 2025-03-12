import { Tasks } from "@/components/tasks";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API URL with proper error handling for production
const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Debug log to identify what URL is being used
console.log('taskApi.ts - Using API URL:', API_URL);

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL,
    credentials: "include",
    // Log requests to help debug API connection issues
    prepareHeaders: (headers, { getState }) => {
      console.log(`Making API request to ${API_URL}`);
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "/tasks/getAll",
      transformResponse: (response: { tasks : Tasks[] }) => {
      
        return response.tasks.map(task => ({
          id: task.id, 
          task: task.task,
          description: task.description,
          status: task.status
        }));
      },
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (body) => ({
        url: "/tasks/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: (body) => ({
        url: `/tasks/update/${body.id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Task', id: arg.id },
        { type: 'Task' }
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/delete/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) => {
        console.log("Delete error response:", response);
        return response;
      },
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
