import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_MOCKAPI_URL;

export const fetchTasksAsync = createAsyncThunk(
  "tasks/fetchTasksAsync",
  async (_, { rejectWithValue }) => {
    //pass {rejectWithValue} as second arg always
    //try catch block is recommended for all async tasks
    try {
      //Making fetch request (GET)
      const response = await axios.get(API_URL); //GET is default method if not specified axios('url) works

      const data = await response.data;
      console.log("from axios GET: ", data);

      //Returning data to be used by reducers
      return data;
    } catch (err) {
      console.error("Error during axios get operation", err.message);
      // throw err; // Re-throw the error if you want it to be caught in a higher-level handler

      // Optionally, you can return a default value to prevent the app from crashing
      // return []; // Example of returning an empty array as fallback

      // return rejectWithValue("Sorry, can't fetch right now. Try again later!") //shows on display for user

      //with axios we can display many responses to user
      if (err.response) {
        return rejectWithValue(
          `Failed to fetch tasks. Server responded with: ${err.response.statusText} (Status: ${err.response.status})`
        );
      } else if (err.request) {
        // Request was made but no response received
        return rejectWithValue(
          "No response from the server. Please try again later."
        );
      } else {
        // Something else happened while setting up the request
        return rejectWithValue(`Error: ${err.message}`);
      }
    }
  }
);

export const addTaskAsync = createAsyncThunk(
  "tasks/addTaskAsync",
  async (newTask, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, newTask);

      // Parse the JSON response from the server
      const data = await response.data;
      console.log("from axios POST: ", response);

      return data; //this has additional id property comes from server
    } catch (err) {
      console.error("Error while adding new blog:", err.message);

      // throw err //throw err to stop app from crashing

      //Here also we can handle the various errors just like above axios.get() catch block

      return rejectWithValue("Sorry, Failed to add a new blog");
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTaskAsync",
  async ({ id, updatedTask }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedTask);

      const data = await response.data;

      console.log("from axios PUT: ", data);

      return data;
    } catch (err) {
      console.error("Error in PUT request:", err.message);

      //Here also can display various errors
      return rejectWithValue("Sorry, Failed to update the blog!");
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTaskAsync",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      
      
      //just to check 
      if(response.statusText === "OK" && response.status === 200)
      {
        console.log('Deleted successfully')
      }

      console.log("from axios DELETE id number: ", id);

      return id; //typically return id only, as its used in reducer to updtate the state
    } catch (err) {
      console.log("Error while deleting: ", err.message);

      //can use various errors
      return rejectWithValue("Failed to delete, Try again later");
    }
  }
);

export const updateReadStatusAsync = createAsyncThunk(
  "tasks/updateReadStatusAsync",
  async ({ id, updatedTask }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedTask);

      const data = await response.data;
      console.log("Updated reading status by axios: ", data);

      return data; //sent to reducer

    } catch (err) {
      console.log("Failed to update reading status: ", err.message);

      return rejectWithValue("Failed to update reading status, retry later");
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    isLoading: false,
    isError: null,
    taskList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksAsync.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskList = action.payload;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(addTaskAsync.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskList.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(updateTaskAsync.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.taskList.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.taskList[index] = action.payload;
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(deleteTaskAsync.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskList = state.taskList.filter(
          (task) => task.id !== action.payload
        );
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    builder
      .addCase(updateReadStatusAsync.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateReadStatusAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.taskList.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.taskList[index] = action.payload;
        }
      })
      .addCase(updateReadStatusAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export default tasksSlice.reducer;
