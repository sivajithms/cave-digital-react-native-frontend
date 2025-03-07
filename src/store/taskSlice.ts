
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TasksState, Task } from '../types';
import { getTasks, storeTasks } from '../utils/storage';
import { generateMockTasks } from '../utils/mockData';

// Initial state
const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
};

// Mock API calls
const mockFetchTasks = async (): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get tasks from AsyncStorage
  let tasks = await getTasks();
  
  // If no tasks exist, generate mock data
  if (!tasks || tasks.length === 0) {
    tasks = generateMockTasks('1');
    await storeTasks(tasks);
  }
  
  return tasks;
};

const mockCreateTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create new task
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  // Get existing tasks and add new task
  const existingTasks = await getTasks();
  const updatedTasks = [...existingTasks, newTask];
  
  // Store updated tasks
  await storeTasks(updatedTasks);
  
  return newTask;
};

const mockUpdateTask = async (task: Task): Promise<Task> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get existing tasks
  const existingTasks = await getTasks();
  
  // Update task
  const updatedTasks = existingTasks.map(t => (t.id === task.id ? task : t));
  
  // Store updated tasks
  await storeTasks(updatedTasks);
  
  return task;
};

const mockDeleteTask = async (taskId: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get existing tasks
  const existingTasks = await getTasks();
  
  // Remove task
  const updatedTasks = existingTasks.filter(t => t.id !== taskId);
  
  // Store updated tasks
  await storeTasks(updatedTasks);
  
  return taskId;
};

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    return await mockFetchTasks();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Omit<Task, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      return await mockCreateTask(task);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task, { rejectWithValue }) => {
  try {
    return await mockUpdateTask(task);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: string, { rejectWithValue }) => {
  try {
    return await mockDeleteTask(taskId);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;
