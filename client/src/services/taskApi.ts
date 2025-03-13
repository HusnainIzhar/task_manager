
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API URL with proper error handling for production
const API_URL = "http://46.202.162.244:9000/api";

// Define interface for task response from server
interface ServerTask {
  id?: string;
  _id?: string;
  title?: string;
  task?: string;
  description: string;
  status: "pending" | "completed";
}

// Debug log to identify what URL is being used
console.log('taskApi.ts - Using API URL:', API_URL)

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      // Add any custom headers needed for CORS
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "/tasks/getAll",
      transformResponse: (response: { tasks: ServerTask[] }) => {
      
        return response.tasks.map(task => ({
          id: task.id || task._id || "", 
          task: task.task || task.title || "",
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
