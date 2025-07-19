import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskForm } from '../TaskForm';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import type { Task, TaskFormData } from '../../types/task';

interface EditTaskProps {
  tasks: Task[];
  onUpdateTask: (id: string, data: TaskFormData) => Promise<void>;
}

export const EditTask: React.FC<EditTaskProps> = ({ tasks, onUpdateTask }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (id) {
      const foundTask = tasks.find(t => t.id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        setError('Task not found');
      }
    }
  }, [id, tasks]);

  const handleSubmit = async (data: TaskFormData) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onUpdateTask(id, data);
      navigate('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  if (!id) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid task ID</AlertDescription>
        </Alert>
        <Button onClick={handleCancel} variant="outline">
          Back to Tasks
        </Button>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleCancel} variant="outline">
          Back to Tasks
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Button>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>
      </div>

      <TaskForm
        task={task}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        error={error}
      />
    </div>
  );
}; 