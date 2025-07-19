from fastapi import FastAPI, HTTPException, Query, Path, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.environ["MONGODB_URL"]
DATABASE_NAME = os.environ["DATABASE_NAME"]
COLLECTION_NAME = os.environ["COLLECTION_NAME"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]
tasks_collection = db[COLLECTION_NAME]

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = ""
    status: str = Field(..., pattern="^(pending|in-progress|completed)$")
    priority: str = Field(..., pattern="^(low|medium|high)$")
    due_date: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    status: Optional[str] = Field(None, pattern="^(pending|in-progress|completed)$")
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    due_date: Optional[str] = None

class Task(TaskBase):
    id: str = Field(alias="_id")
    created_at: str
    updated_at: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

@app.post("/api/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate):
    now = datetime.utcnow()
    task_dict = task.dict()
    
    # Convert due_date string to datetime for storage if provided
    if task_dict.get("due_date"):
        try:
            # Try to parse as ISO format first
            task_dict["due_date"] = datetime.fromisoformat(task_dict["due_date"].replace('Z', '+00:00'))
        except ValueError:
            # If parsing fails, try to parse as date only (YYYY-MM-DD)
            try:
                task_dict["due_date"] = datetime.strptime(task_dict["due_date"], "%Y-%m-%d")
            except ValueError:
                # If that fails, try to parse as ISO format without timezone
                try:
                    task_dict["due_date"] = datetime.fromisoformat(task_dict["due_date"])
                except ValueError:
                    raise HTTPException(status_code=400, detail="Invalid due_date format. Expected YYYY-MM-DD or ISO format")
    
    task_dict.update({"created_at": now, "updated_at": now})
    result = await tasks_collection.insert_one(task_dict)
    task_dict["_id"] = str(result.inserted_id)
    
    # Convert datetime objects to ISO format strings for response
    if "created_at" in task_dict and isinstance(task_dict["created_at"], datetime):
        task_dict["created_at"] = task_dict["created_at"].isoformat()
    if "updated_at" in task_dict and isinstance(task_dict["updated_at"], datetime):
        task_dict["updated_at"] = task_dict["updated_at"].isoformat()
    if "due_date" in task_dict and isinstance(task_dict["due_date"], datetime):
        task_dict["due_date"] = task_dict["due_date"].isoformat()
    
    return task_dict

@app.get("/api/tasks", response_model=List[Task])
async def get_tasks(
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = Query(None, pattern="^(pending|in-progress|completed)$"),
    priority: Optional[str] = Query(None, pattern="^(low|medium|high)$"),
    search: Optional[str] = None
):
    query = {}
    if status:
        query["status"] = status
    if priority:
        query["priority"] = priority
    if search and search.strip():  # Only add search if it's not empty
        query["$or"] = [
            {"title": {"$regex": search.strip(), "$options": "i"}},
            {"description": {"$regex": search.strip(), "$options": "i"}}
        ]
    cursor = tasks_collection.find(query).skip(skip).limit(limit)
    tasks = []
    async for doc in cursor:
        # Convert ObjectId to string
        doc["_id"] = str(doc["_id"])
        # Convert datetime objects to ISO format strings
        if "created_at" in doc and isinstance(doc["created_at"], datetime):
            doc["created_at"] = doc["created_at"].isoformat()
        if "updated_at" in doc and isinstance(doc["updated_at"], datetime):
            doc["updated_at"] = doc["updated_at"].isoformat()
        if "due_date" in doc and isinstance(doc["due_date"], datetime):
            doc["due_date"] = doc["due_date"].isoformat()
        tasks.append(doc)
    return tasks

@app.get("/api/tasks/{id}", response_model=Task)
async def get_task(id: str = Path(...)):
    try:
        task = await tasks_collection.find_one({"_id": ObjectId(id)})
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        # Convert ObjectId to string
        task["_id"] = str(task["_id"])
        # Convert datetime objects to ISO format strings
        if "created_at" in task and isinstance(task["created_at"], datetime):
            task["created_at"] = task["created_at"].isoformat()
        if "updated_at" in task and isinstance(task["updated_at"], datetime):
            task["updated_at"] = task["updated_at"].isoformat()
        if "due_date" in task and isinstance(task["due_date"], datetime):
            task["due_date"] = task["due_date"].isoformat()
        return task
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

@app.put("/api/tasks/{id}", response_model=Task)
async def update_task(id: str, task_update: TaskUpdate):
    try:
        task_data = {k: v for k, v in task_update.dict(exclude_unset=True).items()}
        
        # Convert due_date string to datetime for storage if provided
        if task_data.get("due_date"):
            try:
                # Try to parse as ISO format first
                task_data["due_date"] = datetime.fromisoformat(task_data["due_date"].replace('Z', '+00:00'))
            except ValueError:
                # If parsing fails, try to parse as date only (YYYY-MM-DD)
                try:
                    task_data["due_date"] = datetime.strptime(task_data["due_date"], "%Y-%m-%d")
                except ValueError:
                    # If that fails, try to parse as ISO format without timezone
                    try:
                        task_data["due_date"] = datetime.fromisoformat(task_data["due_date"])
                    except ValueError:
                        raise HTTPException(status_code=400, detail="Invalid due_date format. Expected YYYY-MM-DD or ISO format")
        
        task_data["updated_at"] = datetime.utcnow()
        result = await tasks_collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": task_data},
            return_document=True
        )
        if not result:
            raise HTTPException(status_code=404, detail="Task not found")
        # Convert ObjectId to string
        result["_id"] = str(result["_id"])
        # Convert datetime objects to ISO format strings
        if "created_at" in result and isinstance(result["created_at"], datetime):
            result["created_at"] = result["created_at"].isoformat()
        if "updated_at" in result and isinstance(result["updated_at"], datetime):
            result["updated_at"] = result["updated_at"].isoformat()
        if "due_date" in result and isinstance(result["due_date"], datetime):
            result["due_date"] = result["due_date"].isoformat()
        return result
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

@app.delete("/api/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(id: str):
    try:
        result = await tasks_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
