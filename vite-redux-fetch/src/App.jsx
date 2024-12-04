import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasksAsync,
  addTaskAsync,
  updateReadStatusAsync,
  deleteTaskAsync,
  updateTaskAsync,
} from "./redux/slice/tasksSlice";

/*
Here ,i shifted to createAsyncThunk logic
this keeps the app more coupled as the async logics
are now handed over to redux and redux takes care of them
*/

const App = () => {
  const [blogName, setBlogName] = useState("");
  const [blogImg, setBlogImg] = useState("");
  const [isRead, setIsRead] = useState(false);
  const [blogContent, setBlogContent] = useState("");
  const [editId, setEditId] = useState(null);

  const tasks = useSelector((state) => state.tasks.taskList);
  const isLoading = useSelector((state) => state.tasks.isLoading);
  const isError = useSelector((state) => state.tasks.isError);

  const dispatch = useDispatch();

  // const API_URL = import.meta.env.VITE_MOCKAPI_URL

  useEffect(() => {
    dispatch(fetchTasksAsync());
  }, [dispatch]);

  const handleAddTask = () => {
    if (!blogName || !blogImg || !blogContent) {
      alert("All fields are important while adding");
      return;
    }
    const newTask = { blogName, blogImg, blogContent, isRead: false };
    dispatch(addTaskAsync(newTask));

    setBlogName("");
    setBlogContent("");
    setBlogImg("");
  };

  const handleUpdateTask = () => {
    if (!blogName || !blogImg || !blogContent) {
      alert("All fields are important while updating");
      return;
    }

    const updatedTask = { blogName, blogImg, blogContent, isRead };
    dispatch(updateTaskAsync({ id: editId, updatedTask }));

    setBlogName("");
    setBlogImg("");
    setBlogContent("");
    setIsRead(false);
    setEditId(null);
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTaskAsync(id));
  };

  const handleReadStatus = (id, updatedTask) => {
    dispatch(updateReadStatusAsync({ id, updatedTask }));
  };

  return (
    <div>
      <h1>MockAPI CRUD Example</h1>

      {/* Form for Adding/Editing Tasks */}
      <div style={{ display: "flex", gap: "10px" }}>
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

      {isLoading && <h3 style={{ textAlign: "center" }}>Loading blogs...</h3>}
      {isError && (
        <h3 style={{ textAlign: "center" }}>Oops, Something went wrong!</h3>
      )}

      {/* Display blog tasks */}
      {!isLoading && !isError && (
        <ul>
          <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
            Total blogs: {tasks.length}
          </p>
          {tasks.map((task) => (
            <li key={task.id}>
              <h4>{task.blogName}</h4>
              <img src={`${task.blogImg}`} alt="image" />
              <p>Status: {task.isRead ? "Completed" : "Pending"}</p>
              <p>{task.blogContent}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
                <button
                  onClick={() => {
                    setEditId(task.id);
                    setBlogName(task.blogName);
                    setBlogImg(task.blogImg);
                    setIsRead(task.isRead);
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
        </ul>
      )}
    </div>
  );
};

export default App;
