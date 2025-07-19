import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Dashboard } from './components/pages/Dashboard';
import { Tasks } from './components/pages/Tasks';
import { AddTask } from './components/pages/AddTask';
import { EditTask } from './components/pages/EditTask';
import { Navigation } from './components/Navigation';
import type { Task, TaskFormData, TaskAPIResponse } from './types/task';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to convert API response to frontend format
const convertApiResponseToTask = (apiTask: TaskAPIResponse): Task => ({
  id: apiTask._id,
  title: apiTask.title,
  description: apiTask.description,
  status: apiTask.status,
  priority: apiTask.priority,
  dueDate: apiTask.due_date || '',
  createdAt: apiTask.created_at,
  updatedAt: apiTask.updated_at,
});

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: TaskAPIResponse[] = await response.json();
      const convertedTasks = data.map(convertApiResponseToTask);
      setTasks(convertedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleCreateTask = async (data: TaskFormData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTaskApi: TaskAPIResponse = await response.json();
      const newTask = convertApiResponseToTask(newTaskApi);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      toast.success('Task created successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (id: string, data: TaskFormData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTaskApi: TaskAPIResponse = await response.json();
      const updatedTask = convertApiResponseToTask(updatedTaskApi);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? updatedTask : task
        )
      );
      toast.success('Task updated successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Navigation currentPath={location.pathname} onNavigate={handleNavigate} />
        
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard tasks={tasks} onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/dashboard" 
            element={<Dashboard tasks={tasks} onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/tasks" 
            element={
              <Tasks 
                tasks={tasks} 
                loading={loading} 
                onNavigate={handleNavigate} 
                onDeleteTask={handleDeleteTask} 
              />
            } 
          />
          <Route 
            path="/tasks/new" 
            element={
              <AddTask onCreateTask={handleCreateTask} />
            } 
          />
          <Route 
            path="/tasks/:id/edit" 
            element={
              <EditTask 
                tasks={tasks} 
                onUpdateTask={handleUpdateTask} 
              />
            } 
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;