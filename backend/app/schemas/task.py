from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

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