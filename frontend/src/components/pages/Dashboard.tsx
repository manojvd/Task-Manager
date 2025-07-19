
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { Task } from '../../types/task';

interface DashboardProps {
  tasks: Task[];
  onNavigate: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, onNavigate }) => {
  const stats = React.useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    return { total, pending, inProgress, completed, highPriority, completionRate };
  }, [tasks]);
  

  const recentTasks = React.useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [tasks]);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={() => onNavigate('/tasks/new')} className="flex items-center gap-2">
          <Plus size={16} />
          Add Task
        </Button>
      </div>
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Tasks */}
      <Card>
        <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <TrendingUp className="h-4 w-4 mr-1" />
          All tasks
        </div>
        </CardContent>
      </Card>

      {/* Tasks by Status */}
      <Card>
        <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">Tasks by Status</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-yellow-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            Pending
            </span>
            <span className="font-bold text-yellow-600">{stats.pending}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-blue-600">
            <Clock className="h-4 w-4 mr-1" />
            In Progress
            </span>
            <span className="font-bold text-blue-600">{stats.inProgress}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
            </span>
            <span className="font-bold text-green-600">{stats.completed}</span>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* High Priority Tasks */}
      <Card>
        <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">High Priority Tasks</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Badge className="bg-red-100 text-red-800">High</Badge>
          <span className="ml-2">Critical tasks</span>
        </div>
        </CardContent>
      </Card>
    </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm text-gray-600">{Math.round(stats.completionRate)}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">High Priority Tasks:</span>
                <span className="font-medium">{stats.highPriority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tasks:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
          <Button variant="outline" onClick={() => onNavigate('/tasks')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks yet. Create your first task!</p>
            ) : (
              recentTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                      <p className="text-sm text-gray-600 truncate">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{task.dueDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};