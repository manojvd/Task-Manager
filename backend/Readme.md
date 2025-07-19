# Task Manager Backend API

A FastAPI-based backend for the Task Manager application with a modular architecture.

## Project Structure

```
├── app/
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Database operations and business logic
│   ├── routes/
│   │   ├── __init__.py
│   │   └── tasks.py         # HTTP endpoints and request handling
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── task.py          # Pydantic models for data validation
│   ├── __init__.py
│   ├── database.py          # Database configuration and connection
│   └── main.py              # FastAPI application setup
├── main.py                  # Application entry point
└── requirements.txt         # Python dependencies
```

## Architecture Overview

### Models (`app/models/`)
- Contains business logic and database operations
- Handles data transformation and validation
- Implements CRUD operations for tasks

### Routes (`app/routes/`)
- Defines HTTP endpoints
- Handles request/response logic
- Maps URLs to business logic functions

### Schemas (`app/schemas/`)
- Pydantic models for data validation
- Defines API request/response structures
- Ensures type safety and data integrity

### Database (`app/database.py`)
- MongoDB connection configuration
- Database client setup
- Collection references

## API Endpoints

- `GET /api/tasks` - Get all tasks (with filtering and pagination)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

## Running the Application

1. Activate the virtual environment:
   ```bash
   source bin/activate
   ```

2. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

3. Or use the entry point:
   ```bash
   python main.py
   ```

## Environment Variables

Make sure to set these environment variables:
- `MONGODB_URL` - MongoDB connection string
- `DATABASE_NAME` - Database name
- `COLLECTION_NAME` - Collection name

## Features

- ✅ Modular architecture
- ✅ MongoDB integration with Motor
- ✅ Pydantic v2 data validation
- ✅ CORS support
- ✅ Async/await support
- ✅ Proper error handling
- ✅ Type hints throughout
- ✅ API documentation (Swagger UI at `/docs`)