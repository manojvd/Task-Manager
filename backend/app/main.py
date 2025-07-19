from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import tasks

app = FastAPI(title="Task Manager API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router)

@app.get("/")
async def root():
    return {"message": "Task Manager API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 