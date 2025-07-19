import { useState, useEffect } from 'react';
import type { Task, TaskFormData } from '../types/task';
import { mockTasks } from '../lib/mockData';

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const addTask = async (taskData: TaskFormData): Promise<void> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setTasks(prev => [...prev, newTask]);
    setLoading(false);
  };

  const updateTask = async (id: string, taskData: TaskFormData): Promise<void> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...taskData, updatedAt: new Date().toISOString().split('T')[0] }
        : task
    ));
    setLoading(false);
  };

  const deleteTask = async (id: string): Promise<void> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTasks(prev => prev.filter(task => task.id !== id));
    setLoading(false);
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    getTaskById
  };
};