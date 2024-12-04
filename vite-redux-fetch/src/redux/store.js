import { configureStore } from "@reduxjs/toolkit";
import TasksReducer from "./slice/TasksSlice"

const store = configureStore({
  reducer: {
    tasks: TasksReducer,
  },
});

export default store;