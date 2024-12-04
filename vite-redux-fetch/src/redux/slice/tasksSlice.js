import { createSlice } from "@reduxjs/toolkit";

const TasksSlice = createSlice({
  name: "tasks",
  initialState: {
    taskList: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.taskList = action.payload;
    },
    addTask: (state, action) => {
      state.taskList.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.taskList.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) state.taskList[index] = action.payload;
    },
    deleteTask: (state, action) => {
      state.taskList = state.taskList.filter((task) => task.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = TasksSlice.actions;
export default TasksSlice.reducer;