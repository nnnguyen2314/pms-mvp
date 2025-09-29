import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasks } from '@/shared/api/tasks.api';
import type { Task } from '@/shared/types/task';

// Fetch dashboard data (currently tasks) for a given workspace
export const fetchDashboardTasks = createAsyncThunk<
  Task[],
  string,
  { rejectValue: string }
>('dashboard/fetchTasks', async (workspaceId, { rejectWithValue }) => {
  try {
    const tasks = await fetchTasks(workspaceId);
    return tasks;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || 'Failed to fetch dashboard tasks';
    return rejectWithValue(message);
  }
});
