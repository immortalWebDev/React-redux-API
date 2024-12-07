import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";


const API_URL = import.meta.env.VITE_MOCKAPI_URL;

export const fetchTasksAsync = createAsyncThunk(
  "tasks/fetchTasksAsync",
  async (_,{rejectWithValue}) => { //pass {rejectWithValue} as second arg always
    //try catch block is recommended for all async tasks
    try {
      //Making fetch request (GET)
      const response = await fetch(API_URL); //GET is default method if not specified

      //If status code is outside 200-299
      if (!response.ok) {
        // Throw error with detailed message including status
        throw new Error(
          `Failed to fetch data: ${response.statusText} , Status code: ${response.status}`
        );
      }

      //NOTE: //if wanna handle 404 or 500 explicitly , you can write separate logic for that

      // Parsing JSON data from response (successfull)
      const data = await response.json();
      console.log("from GET: ", data);

      //Returning data to be used by reducers
      return data;
    } catch (err) {
      console.error("Error during fetch operation", err);
      // throw err; // Re-throw the error if you want it to be caught in a higher-level handler

      // Optionally, you can return a default value to prevent the app from crashing
      // return []; // Example of returning an empty array as fallback

      return rejectWithValue("Sorry, can't fetch right now. Try again later!") //shows on display for user

      /*
    If fetch call directly fails, and we do not get response object then the flow will come to catch block straight
    Suppose the url is wrong then we do not even get response object
    at that very moment try block execution stops and the flow is forwarded to catch block
    to handle the error gracefully, so that the app doesnt crash
    
    But if the call is succefull but we get status outside of 200 range, then we need
    to handle it explicitly if we want, otherwise the flow will go to catch block
    */
    }
  }
);

export const addTaskAsync = createAsyncThunk(
  "tasks/addTaskAsync",
  async (newTask,{rejectWithValue}) => {
try{

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //not case-sensitive but important for fetch() 
      body: JSON.stringify(newTask),
    });
    
    // Check if the response is OK (2xx range)
    if (!response.ok) {
      // Throw an error with the status code and message for debugging
      throw new Error(`Failed to add blog task: ${response.statusText}, Status code: ${response.status}`);
    }

    // Parse the JSON response from the server
    const data = await response.json();
    console.log("from POST: ", data);

    return data; //this has additional id property comes from server
  }catch(err){

    console.error("Error while adding new blog:", err.message);

    // throw err //throw err to stop app from crashing

    return rejectWithValue("Sorry, Failed to add a new blog") 


  }
  }
);

export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTaskAsync",
  async ({ id, updatedTask },{rejectWithValue}) => {

    try{

    
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to update blog: ${response.statusText}, Status code: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("from PUT: ", data);
    return data;
  }catch(err){

    console.error("Error in PUT request:", err.message);
    
    return rejectWithValue('Sorry, Failed to update the blog!')

  }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTaskAsync",
  async (id,{rejectWithValue}) => {
    try{

    
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to update blog: ${response.statusText}, Status code: ${response.status}`
      );
    }

    console.log("from DELETE: ", id);

    return id;
  }catch(err){
    console.log("Error while deleting: ", err.message)

    return rejectWithValue("Failed to delete, Try again later")
  }
  }
);

export const updateReadStatusAsync = createAsyncThunk(
  "tasks/updateReadStatusAsync",
  async ({ id, updatedTask },{rejectWithValue}) => {
    try{

    
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update blog: ${response.statusText}, Status code: ${response.status}`
      );
    }
    const data = await response.json();
    console.log('Updated reading status: ', data)
    return data

  }catch(err){
    console.log("Failed to update reading status: " ,err.message)

    return rejectWithValue("Failed to update reading status, retry later")
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
      .addCase(fetchTasksAsync.rejected, (state,action) => {
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
      .addCase(addTaskAsync.rejected, (state,action) => {
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
      .addCase(updateTaskAsync.rejected, (state,action) => {
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
      .addCase(deleteTaskAsync.rejected, (state,action) => {
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
      .addCase(updateReadStatusAsync.rejected, (state,action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

// export const { setTasks, addTask, updateTask, deleteTask,setLoading,setError } = tasksSlice.actions;
export default tasksSlice.reducer;
