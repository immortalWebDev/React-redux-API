import { configureStore } from "@reduxjs/toolkit";
import TasksReducer from "./slice/tasksSlice"

const store = configureStore({
  reducer: {
    tasks: TasksReducer,
  },
});

export default store;