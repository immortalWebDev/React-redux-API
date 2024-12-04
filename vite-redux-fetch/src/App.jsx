import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTask,
  updateTask,
  deleteTask,
  setTasks,
  setLoading,
  setError,
} from "./redux/slice/tasksSlice";

/*
Here , I have used utility functions based fetching from API
I have excluded redux from fetching functionality, by doing this
the redux's control over app becomes little lighter 
but this way is not recommended if you want fine gain control over your app
use createAsyncThunk if you wanna include async part in redux
or use middlewares
*/


const App = () => {


  const [blogName, setBlogName] = useState("");
  const [blogImg, setBlogImg] = useState("");
  const [isRead, setIsRead] = useState(false);
  const [blogContent, setBlogContent] = useState("");
  const [editId, setEditId] = useState(null); 

  const tasks = useSelector((state) => state.tasks.taskList); 
  const isLoading = useSelector((state) => state.tasks.isLoading)
  const isError = useSelector((state) => state.tasks.isError)


  const dispatch = useDispatch();

  const API_URL = import.meta.env.VITE_MOCKAPI_URL

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        dispatch(setLoading(true))
        const response = await fetch(API_URL);
        const data = await response.json();
        // console.log(data)
        dispatch(setTasks(data)); // Save to Redux
      } catch (error) {
        console.error("Error fetching tasks:", error);
        dispatch(setError(true))
      }finally{
        dispatch(setLoading(false))
      }
    };
    fetchTasks();
  }, [dispatch]);

  // Add a new task
  const handleAddTask = async () => {
    try {
      const newTask = { blogName, blogImg, blogContent };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      dispatch(addTask(data)); // Update Redux

      setBlogName("");
      setBlogImg("");
      setBlogContent("");
    } catch (error) {
      console.error("Error adding task:", error);
      dispatch(setError(true))
    }
  };

  // Update an existing task
  const handleUpdateTask = async () => {

    if(!blogName || !blogImg || !blogContent)
    {
      alert('All filds are important')
      return
    }

    try {
      dispatch(setLoading(true))
      const updatedTask = { blogName, blogImg, isRead, blogContent };
      const response = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      const data = await response.json();

      dispatch(updateTask(data)); // Update Redux

      //Resetting input fields
      setBlogName("");
      setBlogImg("");
      setBlogContent("");
      setIsRead(false)
      setEditId(null);
    } catch (error) {
      console.error("Error updating task:", error);
      dispatch(setError(true))
    }finally{
    dispatch(setLoading(false))
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      dispatch(deleteTask(id)); // Update Redux
    } catch (error) {
      console.error("Error deleting task:", error);
      dispatch(setError(true))
    }
  };

  //for reading status specifically as its outside input fields
  const handleReadStatus = async (id, updatedTask) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      const data = await response.json();
      dispatch(updateTask(data));
    } catch (error) {
      console.log("Error while updating reading status",error);
      dispatch(setError(true))
    }
  };

  return (
    <div>
      <h1>MockAPI CRUD Example</h1>

      {/* Form for Adding/Editing Tasks */}
      <div>
        <input
          type="text"
          placeholder="Blog Name"
          value={blogName}
          onChange={(e) => setBlogName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Img url"
          value={blogImg}
          onChange={(e) => setBlogImg(e.target.value)}
        />
        <input
          type="text"
          placeholder="Blog content"
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
        />
        <button onClick={editId ? handleUpdateTask : handleAddTask}>
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      <hr />

      {isLoading && <h3 style={{textAlign:'center'}}>Loading blogs...</h3>}
      {isError && <h3 style={{textAlign:'center'}}>Oops, Something went wrong!</h3>}

      {/* Display blog tasks */}
      {!isLoading && !isError && <ul>
        <p style={{fontSize: '1rem',fontWeight:'bold'}}>Total blogs: {tasks.length}</p>
        {tasks.map((task) => (
          <li key={task.id}>
            <h4>{task.blogName}</h4>
            <img src={`${task.blogImg}`} alt="image" />
            <p>Status: {task.isRead ? "Completed" : "Pending"}</p>
            <p>{task.blogContent}</p>
            <div style={{display:"flex",gap:'10px'}}>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            <button
              onClick={() => {
                setEditId(task.id);
                setBlogName(task.blogName);
                setBlogImg(task.blogImg);
                 setIsRead(task.isRead)
                setBlogContent(task.blogContent);
              }}
            >
              Edit
            </button>
            {!task.isRead && (
              <button
                onClick={() => {
                  const updatedTask = {
                    ...task,
                    isRead: true,
                  };
                  handleReadStatus(task.id, updatedTask);
                }}
              >
                Done reading
              </button>
            )}
            </div>
            <hr />
          </li>
        ))}
      </ul>}
    </div>
  );
};

export default App;
