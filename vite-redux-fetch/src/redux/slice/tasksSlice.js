import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_MOCKAPI_URL;

export const fetchTasksAsync = createAsyncThunk(
  "tasks/fetchTasksAsync",
  async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return await response.json();
  }
);

export const addTaskAsync = createAsyncThunk(
  "tasks/addTaskAsync",
  async (newTask) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    if (!response.ok) throw new Error("Failed to add task");
    return await response.json();
  }
);

export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTaskAsync",
  async ({ id, updatedTask }) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return await response.json();
  }
);

export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTaskAsync",
  async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to update task");

    return id;
  }
);

export const updateReadStatusAsync = createAsyncThunk(
  "tasks/updateReadStatusAsync",
  async ({ id, updatedTask }) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) throw new Error("Failed to update read status");
    return await response.json();
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    isLoading: false,
    isError: false,
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
      .addCase(fetchTasksAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
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
      .addCase(addTaskAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
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
      .addCase(updateTaskAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
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
      .addCase(deleteTaskAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
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
      .addCase(updateReadStatusAsync.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// export const { setTasks, addTask, updateTask, deleteTask,setLoading,setError } = tasksSlice.actions;
export default tasksSlice.reducer;



//Thunk function
/*
A thunk is a function that gets dispatched like a regular action but allows you to perform side effects,
 such as making an API call, before dispatching a result action to update the Redux store.

When you dispatch a createAsyncThunk function (e.g., fetchTasksAsync()), it doesn't directly go to the reducer. 
Instead, createAsyncThunk acts as a middleware, runs the async logic, and then dispatches actions like pending, fulfilled, or rejected.

createAsyncThunk helps you avoid writing middleware or managing multiple actions manually.
It simplifies the process of handling async code in Redux.



 Redux Toolkit automatically generates three action types from this:
"tasks/fetchTasksAsync/pending"
"tasks/fetchTasksAsync/fulfilled"
"tasks/fetchTasksAsync/rejected"

syntax:

 createAsyncThun(sliceName/thunkFunctionName,async (payloadCreator)=> {
      fetch logic
  })

  here payloadCreator is payload we pass to dispatch(thunkFuncName(payload)) in component


console.log(fetchTasksAsync)
this gives the thunk function definition

This is because fetchTasksAsync is a function created by createAsyncThunk.
here createAsyncThunk acts as a function factory


console.log(fetchTasksAsync())
this gives us the return value of thunk function
which is usually a promise

The promise resolves when the async operation inside the thunk finishes (success or failure).

once that promise is fulfilled then that value is used in

.addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskList = action.payload;
        })

HERE:

addCase is a method attached to the builder object, 
it is available in the extraReducers function of a createSlice or createReducer 

this method takes action type or action creator and reducer function as args
and updates the state based on that 

here,

fetchTasksAsync.fulfilled this is shorthand for 
"tasks/fetchTasksAsync/fulfilled"
both will work. but its better to handle it through shorthand



FLOW:

A user interaction triggers an action

The action is sent to the store using dispatch.

If it's an async action (like createAsyncThunk), middleware intercepts it
Middleware handles the async logic and dispatches pending, fulfilled, or rejected actions as needed.

The store forwards the action to the relevant reducer (sync) or extra reducer (async).
Based on the action type (e.g., pending, fulfilled, rejected), the reducer updates the state.

As the reducer updates the state. The new state is recognised by store

Components which are subscribed to store using useSelector automatically re-render
(because state changed)

*/