from fastapi import APIRouter, HTTPException, Query, Path, status
from typing import List, Optional
from ..schemas.task import Task, TaskCreate, TaskUpdate
from ..models.task import TaskModel

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("/test")
async def test_endpoint():
    return {"message": "Tasks router is working"}

@router.get("/mock")
async def get_mock_tasks():
    return [
        {
            "_id": "1",
            "title": "Mock Task",
            "description": "Mock Description",
            "status": "pending",
            "priority": "medium",
            "due_date": "2024-01-30T00:00:00",
            "created_at": "2024-01-15T10:00:00",
            "updated_at": "2024-01-15T10:00:00"
        }
    ]

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate):
    task_dict = task.dict()
    result = await TaskModel.create_task(task_dict)
    return result

@router.get("/", response_model=List[Task])
async def get_tasks(
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = Query(None, pattern="^(pending|in-progress|completed)$"),
    priority: Optional[str] = Query(None, pattern="^(low|medium|high)$"),
    search: Optional[str] = None
):
    tasks = await TaskModel.get_tasks(skip=skip, limit=limit, status=status, priority=priority, search=search)
    return tasks

@router.get("/{id}", response_model=Task)
async def get_task(id: str = Path(...)):
    task = await TaskModel.get_task_by_id(id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{id}", response_model=Task)
async def update_task(id: str, task_update: TaskUpdate):
    task_data = {k: v for k, v in task_update.dict(exclude_unset=True).items()}
    result = await TaskModel.update_task(id, task_data)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return result

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(id: str):
    success = await TaskModel.delete_task(id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return 