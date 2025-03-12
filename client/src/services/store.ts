
import { configureStore } from "@reduxjs/toolkit";
import { taskApi } from "./taskApi";
import { userApi } from "./userApi";

export const store = configureStore({
  reducer: {
    [taskApi.reducerPath]: taskApi.reducer,

    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware, userApi.middleware),
});
