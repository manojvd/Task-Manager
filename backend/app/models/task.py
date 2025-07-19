from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from typing import List, Optional
import logging
from ..database import tasks_collection

logger = logging.getLogger(__name__)

class TaskModel:
    @staticmethod
    async def create_task(task_data: dict) -> dict:
        try:
            now = datetime.utcnow()
            
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
                            raise ValueError("Invalid due_date format. Expected YYYY-MM-DD or ISO format")
            
            task_data.update({"created_at": now, "updated_at": now})
            result = await tasks_collection.insert_one(task_data)
            task_data["_id"] = str(result.inserted_id)
            
            # Convert datetime objects to ISO format strings for response
            if "created_at" in task_data and isinstance(task_data["created_at"], datetime):
                task_data["created_at"] = task_data["created_at"].isoformat()
            if "updated_at" in task_data and isinstance(task_data["updated_at"], datetime):
                task_data["updated_at"] = task_data["updated_at"].isoformat()
            if "due_date" in task_data and isinstance(task_data["due_date"], datetime):
                task_data["due_date"] = task_data["due_date"].isoformat()
            
            return task_data
        except Exception as e:
            logger.error(f"Error creating task: {e}")
            raise

    @staticmethod
    async def get_tasks(
        skip: int = 0,
        limit: int = 10,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[dict]:
        try:
            logger.info(f"Fetching tasks with skip={skip}, limit={limit}, status={status}, priority={priority}, search={search}")
            
            # Build query based on provided parameters
            query = {}
            if status:
                query["status"] = status
            if priority:
                query["priority"] = priority
            if search and search.strip():
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
            
        except Exception as e:
            logger.error(f"Error fetching tasks: {e}")
            return []

    @staticmethod
    async def get_task_by_id(task_id: str) -> Optional[dict]:
        try:
            task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
            if not task:
                return None
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
            return None
        except Exception as e:
            logger.error(f"Error fetching task by ID: {e}")
            raise

    @staticmethod
    async def update_task(task_id: str, task_data: dict) -> Optional[dict]:
        try:
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
                            raise ValueError("Invalid due_date format. Expected YYYY-MM-DD or ISO format")
            
            task_data["updated_at"] = datetime.utcnow()
            result = await tasks_collection.find_one_and_update(
                {"_id": ObjectId(task_id)},
                {"$set": task_data},
                return_document=True
            )
            if not result:
                return None
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
            return None
        except Exception as e:
            logger.error(f"Error updating task: {e}")
            raise

    @staticmethod
    async def delete_task(task_id: str) -> bool:
        try:
            result = await tasks_collection.delete_one({"_id": ObjectId(task_id)})
            return result.deleted_count > 0
        except InvalidId:
            return False
        except Exception as e:
            logger.error(f"Error deleting task: {e}")
            raise 