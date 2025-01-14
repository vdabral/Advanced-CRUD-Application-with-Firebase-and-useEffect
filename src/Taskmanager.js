import React, { useState, useEffect } from "react";
import { db, ref, set, push, onValue, remove, update } from './firebase'; // Import the necessary Firebase functions

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskStatus, setTaskStatus] = useState({
    notStarted: 0,
    ongoing: 0,
    completed: 0,
  });

  const dbRef = ref(db, "tasks/");

  // Fetch tasks from Firebase
  useEffect(() => {
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const taskList = [];
      const statusCount = { completed: 0, ongoing: 0, notStarted: 0 };

      for (let id in data) {
        taskList.push({ id, ...data[id] });
        statusCount[data[id].status] += 1;
      }

      setTasks(taskList);
      setTaskStatus(statusCount);
    });

    return () => unsubscribe();
  }, [dbRef]);  // Include dbRef here to resolve the warning

  // Add new task to Firebase
  const addTask = () => {
    if (newTask.trim() !== "") {
      const taskRef = push(dbRef); // Create a new reference for a new task
      set(taskRef, {
        name: newTask,
        status: "not-started", // Default status for a new task
      }).then(() => {
        setNewTask(""); // Clear input field after adding task
      }).catch((error) => {
        console.error("Error adding task:", error);
      });
    } else {
      alert("Please enter a task name.");
    }
  };

  // Edit task name in Firebase
  const editTask = (id, newName) => {
    const taskRef = ref(db, `tasks/${id}`);
    update(taskRef, { name: newName });
  };

  // Delete task from Firebase
  const deleteTask = (id) => {
    const taskRef = ref(db, `tasks/${id}`);
    remove(taskRef);
  };

  return (
    <div className="task-manager">
      <h1 className="title">Task Management</h1>

      {/* Input to add new task */}
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Navbar showing task counts */}
      <div className="navbar">
        <div className="status-card">
          <h3>Not Started</h3>
          <p>{taskStatus.notStarted}</p>
          <div className="task-list">
            {tasks
              .filter((task) => task.status === "not-started")
              .map((task) => (
                <p key={task.id}>{task.name}</p>
              ))}
          </div>
        </div>
        <div className="status-card">
          <h3>Ongoing</h3>
          <p>{taskStatus.ongoing}</p>
          <div className="task-list">
            {tasks
              .filter((task) => task.status === "ongoing")
              .map((task) => (
                <p key={task.id}>{task.name}</p>
              ))}
          </div>
        </div>
        <div className="status-card">
          <h3>Completed</h3>
          <p>{taskStatus.completed}</p>
          <div className="task-list">
            {tasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <p key={task.id}>{task.name}</p>
              ))}
          </div>
        </div>
      </div>

      {/* List of tasks with options to edit or delete */}
      <div className="task-cards">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <input
              type="text"
              value={task.name}
              onChange={(e) => editTask(task.id, e.target.value)}
            />
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
