import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { Loading } from '@/shared/types';
import type { Task } from '@/shared/types/task';
import { fetchTasksByWorkspace } from '@/features/tasks/store/tasks.actions';

export type TasksStore = {
  lastViewedWorkspaceId: string | null;
  selectedTaskId: string | null;
  tasks: Task[];
  loading: Loading;
  error?: string | null;
};

export const initialState: TasksStore = {
  lastViewedWorkspaceId: null,
  selectedTaskId: null,
  tasks: [],
  loading: Loading.idle,
  error: null,
};

const errorHandler = (state: TasksStore, payload: string) => {
  state.loading = Loading.failed;
  state.error = payload;
};

const tasksExtraReducers = (builder: ActionReducerMapBuilder<TasksStore>) => {
  builder
    .addCase(fetchTasksByWorkspace.pending, (state, action) => {
      state.loading = Loading.pending;
      state.error = null;
      state.tasks = [];
      state.lastViewedWorkspaceId = action.meta.arg ?? null;
    })
    .addCase(fetchTasksByWorkspace.rejected, (state, action) => {
      state.tasks = [];
      errorHandler(state, action.payload as string);
    })
    .addCase(fetchTasksByWorkspace.fulfilled, (state, action) => {
      state.loading = Loading.succeeded;
      state.tasks = action.payload || [];
      state.error = null;
      state.lastViewedWorkspaceId = action.meta.arg ?? state.lastViewedWorkspaceId;
    });
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  extraReducers: tasksExtraReducers,
  reducers: {
    setLastViewedWorkspace(state, action) {
      state.lastViewedWorkspaceId = action.payload ?? null;
    },
    setSelectedTask(state, action) {
      state.selectedTaskId = action.payload ?? null;
    },
    clearError(state) {
      state.error = null;
    },
    resetState: () => initialState,
  },
});

const persistConfig = {
  key: 'tasks',
  storage,
};

export const { setLastViewedWorkspace, setSelectedTask, clearError, resetState } = tasksSlice.actions;
export default persistReducer(persistConfig, tasksSlice.reducer);
