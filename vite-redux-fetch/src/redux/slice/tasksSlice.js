import { createSlice } from "@reduxjs/toolkit";

const TasksSlice = createSlice({
  name: "tasks",
  initialState: {
    isLoading:false,
    isError:false,
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
    setLoading: (state,action) => {
      state.isLoading = action.payload
    },
    setError:(state,action) => {
      state.isError = action.payload
    }
  },
});

export const { setTasks, addTask, updateTask, deleteTask,setLoading,setError } = TasksSlice.actions;
export default TasksSlice.reducer;