
import { Task } from '../types';

export const generateMockTasks = (userId: string): Task[] => {
  return [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the proposal for the new client project including timeline and budget estimates.',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      createdAt: new Date().toISOString(),
      userId,
    },
    {
      id: '2',
      title: 'Schedule team meeting',
      description: 'Coordinate with team members to find a suitable time for weekly sync-up.',
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
      createdAt: new Date().toISOString(),
      userId,
    },
    {
      id: '3',
      title: 'Review code changes',
      description: 'Go through pull requests and provide feedback on code changes.',
      completed: true,
      priority: 'medium',
      dueDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      createdAt: new Date().toISOString(),
      userId,
    },
    {
      id: '4',
      title: 'Update documentation',
      description: 'Update the project documentation with recent changes and new features.',
      completed: false,
      priority: 'low',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
      createdAt: new Date().toISOString(),
      userId,
    },
    {
      id: '5',
      title: 'Prepare for presentation',
      description: 'Create slides and rehearse for the upcoming client presentation.',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      createdAt: new Date().toISOString(),
      userId,
    },
  ];
};
