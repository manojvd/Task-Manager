import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../TaskForm';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import type { TaskFormData } from '../../types/task';

interface AddTaskProps {
  onCreateTask: (data: TaskFormData) => Promise<void>;
}

export const AddTask: React.FC<AddTaskProps> = ({ onCreateTask }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: TaskFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      await onCreateTask(data);
      navigate('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

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
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        error={error}
      />
    </div>
  );
}; 