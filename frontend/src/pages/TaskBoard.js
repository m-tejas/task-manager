import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask } from '../services/api';
import TaskColumn from '../components/TaskColumn';
import { DragDropContext } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await getTasks();
        setTasks(data);
      } catch (error) {
        toast.error("Failed to fetch tasks.");
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        const { data } = await createTask({ title: newTask, column: 'todo' });
        setTasks((prevTasks) => [...prevTasks, data]);
        setNewTask('');
      } catch (error) {
        toast.error("Error adding new task.");
      }
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    const updatedTask = tasks.find((task) => task._id === draggableId);
    updatedTask.column = destination.droppableId;

    try {
      await updateTask(draggableId, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === draggableId ? updatedTask : task))
      );
    } catch (error) {
      toast.error("Error updating task status.");
    }
  };

  return (
    <div className="task-board">
      <h2>Task Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns">
          <TaskColumn tasks={tasks} status="todo" />
          <TaskColumn tasks={tasks} status="in-progress" />
          <TaskColumn tasks={tasks} status="done" />
        </div>
      </DragDropContext>
      <div className="add-task">
        <input
          type="text"
          placeholder="Add New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
}

export default TaskBoard;
