import React, { useState, useEffect } from "react";
import { db, dbRef, push, set, onValue, update, ref } from "./firebase"; // Import Firebase methods

function TaskManager() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState({ completed: 0, ongoing: 0, notStarted: 0 });

  // Fetch tasks from Firebase and update task statuses
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
  }, []); // Remove dbRef from the dependency array

  // Add a new task to Firebase
  const addTask = () => {
    if (newTask.trim() !== "") {
      const taskRef = push(dbRef); // Create a new reference for a new task
      set(taskRef, {
        name: newTask,
        status: "not-started", // Default status for a new task
      })
        .then(() => {
          setNewTask(""); // Clear input field after adding task
        })
        .catch((error) => {
          console.error("Error adding task:", error);
          alert("Failed to add task: " + error.message);
        });
    } else {
      alert("Please enter a task name.");
    }
  };

  // Update task status (Completed, Ongoing, Not Started)
  const updateStatus = (taskId, newStatus) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    update(taskRef, {
      status: newStatus,
    })
      .then(() => {
        console.log(`Task status updated to ${newStatus}`);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  // Edit task name
  const editTask = (taskId, newName) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    update(taskRef, {
      name: newName,
    })
      .then(() => {
        console.log(`Task name updated`);
      })
      .catch((error) => {
        console.error("Error updating task name:", error);
      });
  };

  // Delete a task
  const deleteTask = (taskId) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    update(taskRef, {
      name: null,
      status: null,
    })
      .then(() => {
        console.log("Task deleted");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
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

      {/* Navbar with task count and status */}
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

      {/* Task list */}
      <div className="task-cards">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <input
              type="text"
              value={task.name}
              onChange={(e) => editTask(task.id, e.target.value)}
            />
            <button onClick={() => updateStatus(task.id, "completed")}>
              Mark as Completed
            </button>
            <button onClick={() => updateStatus(task.id, "ongoing")}>
              Mark as Ongoing
            </button>
            <button onClick={() => updateStatus(task.id, "not-started")}>
              Mark as Not Started
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskManager;
