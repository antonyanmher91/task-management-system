# Task Management System

## Overview

A task management system built with Node.js and MongoDB. Provides an API for task creation, updating, retrieval, and reporting.

## Installation

1. Clone the repository:
    ```bash
    git clone <repo-url>
    cd task-management-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Setup environment variables:
    Create a `.env` file and add:
    ```
    MONGO_URI=your_mongodb_uri
    ```

4. Run the server:
    ```bash
    npm start
    ```

5. Run tests:
    ```bash
    npm test
    ```

## API Endpoints

- `POST /tasks`: Create a new task
- `GET /tasks/:id`: Get task details
- `PUT /tasks/:id`: Update task
- `DELETE /tasks/:id`: Delete task
- `GET /tasks/report/completion`: Get task completion report
