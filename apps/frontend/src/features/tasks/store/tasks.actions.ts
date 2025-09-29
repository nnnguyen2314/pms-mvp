import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasks } from '@/shared/api/tasks.api';
import type { Task } from '@/shared/types/task';

// Fetch tasks for a given workspace
export const fetchTasksByWorkspace = createAsyncThunk<
  Task[],
  string,
  { rejectValue: string }
>('tasks/fetchByWorkspace', async (workspaceId, { rejectWithValue }) => {
  try {
    const tasks = await fetchTasks(workspaceId);
    return tasks;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || 'Failed to fetch tasks';
    return rejectWithValue(message);
  }
});
