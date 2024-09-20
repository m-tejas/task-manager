# Task Manager App

## Overview

This is a Task Manager application built with the **MERN stack**. It allows users to register, log in, and manage tasks. Tasks can be categorized into **To-Do**, **In-Progress**, and **Done**, and users can move tasks between these columns.

## Features

- User authentication (JWT-based)
- Task creation, update, and deletion
- Task status management (To-Do, In-Progress, Done)
- User-specific task management (tasks are tied to users)
- Responsive frontend with drag-and-drop functionality for task management

## Folder Structure
task-manager-app/
├── backend/                # Backend Node.js API
│   ├── config/             # Database connection
│   ├── controllers/        # Task and authentication logic
│   ├── middleware/         # JWT authentication middleware
│   ├── models/             # Mongoose models for User and Task
│   ├── routes/             # API routes for tasks and auth
│   ├── tests/              # Mocha/Chai tests
│   ├── server.js           # Main server file
│   
├── frontend/               # React frontend for task management
│   ├── components/         # React components (TaskColumn, etc.)
│   ├── pages/              # Pages (Login, Register, TaskBoard)
│   ├── services/           # API services
│   ├── styles/             # CSS styles
│   ├── App.js              # Main React app
│   └── index.js            # React entry point
├── package.json            # Dependencies for backend
└── README.md               # Project documentation
└── .env                    # Environment variables
