import type { Task } from '../types/task';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature release',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-12-30',
    createdAt: '2024-12-15',
    updatedAt: '2024-12-15'
  },
  {
    id: '2',
    title: 'Review code changes',
    description: 'Review pull requests from team members and provide feedback',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-12-25',
    createdAt: '2024-12-14',
    updatedAt: '2024-12-16'
  },
  {
    id: '3',
    title: 'Fix bug in payment system',
    description: 'Investigate and fix the payment processing bug reported by users',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-12-20',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-18'
  },
  {
    id: '4',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions and test compatibility',
    status: 'pending',
    priority: 'low',
    dueDate: '2024-12-28',
    createdAt: '2024-12-12',
    updatedAt: '2024-12-12'
  },
  {
    id: '5',
    title: 'Design new landing page',
    description: 'Create mockups and wireframes for the new landing page design',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-12-26',
    createdAt: '2024-12-11',
    updatedAt: '2024-12-15'
  },
  {
    id: '6',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated deployment pipeline for the project',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-12-18',
    createdAt: '2024-12-08',
    updatedAt: '2024-12-17'
  },
  {
    id: '7',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-12-22',
    createdAt: '2024-12-13',
    updatedAt: '2024-12-13'
  },
  {
    id: '8',
    title: 'Optimize database queries',
    description: 'Improve performance of slow database queries',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-12-24',
    createdAt: '2024-12-09',
    updatedAt: '2024-12-14'
  }
];