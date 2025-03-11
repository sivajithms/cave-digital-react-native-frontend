
import { Task } from '../types';

export const generateMockTasks = (userId: string): Task[] => {
  return [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the proposal for the new client project including timeline and budget estimates.',
      completed: false,
      priority: 'high',
      createdAt: new Date().toISOString(),
      userId,
    },
    {
      id: '2',
      title: 'Schedule team meeting',
      description: 'Coordinate with team members to find a suitable time for weekly sync-up.',
      completed: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      userId,
    },
    {
      id: '3',
      title: 'Review code changes',
      description: 'Go through pull requests and provide feedback on code changes.',
      completed: true,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      userId,
    },
    {
      id: '4',
      title: 'Update documentation',
      description: 'Update the project documentation with recent changes and new features.',
      completed: false,
      priority: 'low',
      createdAt: new Date().toISOString(),
      userId,
    },
    {
      id: '5',
      title: 'Prepare for presentation',
      description: 'Create slides and rehearse for the upcoming client presentation.',
      completed: false,
      priority: 'high',
      createdAt: new Date().toISOString(),
      userId,
    },
  ];
};
