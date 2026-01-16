# Task Management System for Small Teams

## Overview
A full‑stack web application that implements **Task 2** from the provided PDF. It allows small teams to register, log in, create tasks, assign them to team members, track status, and receive deadline reminders.

## Features
- **User Authentication** – JWT based sign‑up and login.
- **Task CRUD** – Create, read, update, delete tasks.
- **Assignment Logic** – Assign tasks to registered users.
- **Deadline Reminders** – Visual cues for approaching deadlines.
- **Responsive UI** – Built with React & Vite, premium look with animations.
- **Persisted Data** – SQLite database on the server.

## Tech Stack
- **Backend**: Node.js, Express, SQLite, JWT, `nodemon`.
- **Frontend**: React, Vite, vanilla CSS (custom design system), Axios.
- **Development**: npm workspaces (client & server), Git for version control.

## Installation
```bash
# Clone the repository (already done)
cd /Users/sreekar/Desktop/ppp/task-management-system

# Server setup
cd server
npm install
npm run dev   # runs on http://localhost:5000

# Client setup (in a new terminal)
cd ../client
npm install
npm run dev   # runs on http://localhost:5173
```

## API Endpoints
- `POST /api/auth/register` – Register a new user.
- `POST /api/auth/login` – Login and receive JWT.
- `GET /api/tasks` – Get all tasks (auth required).
- `POST /api/tasks` – Create a task.
- `PUT /api/tasks/:id` – Update task (status, assignee, etc.).
- `DELETE /api/tasks/:id` – Delete a task.

All protected routes require an `Authorization: Bearer <token>` header.

## Usage
1. Open the client at `http://localhost:5173`.
2. Register or log in.
3. Use the dashboard to create, assign, and manage tasks.
4. Tasks nearing their deadline show a toast reminder.

## Contributing
Feel free to open issues or submit pull requests. Follow the existing code style and run `npm run lint` before committing.

## Author

**Name:** K.SREEKAR
**Email:** ksreekarvenkata@gmail.com