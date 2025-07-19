import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Home, ListTodo } from 'lucide-react';

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPath, onNavigate }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <nav className="flex items-center space-x-4">
          <Button
            variant={currentPath === '/' || currentPath === '/dashboard' ? 'default' : 'outline'}
            onClick={() => onNavigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <Home size={16} />
            Dashboard
          </Button>
          <Button
            variant={currentPath === '/tasks' ? 'default' : 'outline'}
            onClick={() => onNavigate('/tasks')}
            className="flex items-center gap-2"
          >
            <ListTodo size={16} />
            Tasks
          </Button>
        </nav>
      </CardContent>
    </Card>
  );
}; 