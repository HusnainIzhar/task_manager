import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
require('dotenv').config();

const API_URL = process.env.API_URL;

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: "include" }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "/tasks/getAll",
      transformResponse: (response: { tasks: any[] }) => {
      
        return response.tasks.map(task => ({
          id: task._id, 
          task: task.title,
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
