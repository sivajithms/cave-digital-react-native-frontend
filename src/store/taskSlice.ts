
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { services } from '../API/api';
import { Task, TasksState } from '../types';

// Initial state
const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
};


// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (id:string | undefined, { rejectWithValue }) => {
  try {
    return await services.fetchTasks({id});
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Omit<Task, '_id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const data = await services.createTasks(task);
      console.log('hii', data);

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task, { rejectWithValue }) => {
  try {
    return await services.updateTask(task);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (_id: string, { rejectWithValue }) => {
  try {
    const data = await services.deleteTask({_id});
    console.log(data);
    return data
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
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
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
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;
