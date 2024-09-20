const Task = require('../models/Task');

// Create a task
const createTask = async (req, res) => {
  const { title, description, column } = req.body;

  // Check if title and column are provided
  if (!title || !column) {
    return res.status(400).json({ message: "Title and column required" });
  }

  try {
    const task = new Task({
      title,
      description,
      column,
      user: req.user.id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { title, description, column } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure that the user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update task details
    task.title = title || task.title;
    task.description = description || task.description;
    task.column = column || task.column;

    task = await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure that the user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.remove();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
