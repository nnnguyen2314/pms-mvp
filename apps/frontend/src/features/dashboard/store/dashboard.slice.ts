import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { Loading } from '@/shared/types';
import type { Task } from '@/shared/types/task';
import { fetchDashboardTasks } from './dashboard.actions';

export type DashboardStore = {
  workspaceId: string | null;
  tasks: Task[];
  loading: Loading;
  error?: string | null;
};

export const initialState: DashboardStore = {
  workspaceId: null,
  tasks: [],
  loading: Loading.idle,
  error: null,
};

const errorHandler = (state: DashboardStore, payload: string) => {
  state.loading = Loading.failed;
  state.error = payload;
};

const dashboardExtraReducers = (builder: ActionReducerMapBuilder<DashboardStore>) => {
  builder
    .addCase(fetchDashboardTasks.pending, (state) => {
      state.loading = Loading.pending;
      state.error = null;
      state.tasks = [];
    })
    .addCase(fetchDashboardTasks.rejected, (state, action) => {
      state.tasks = [];
      errorHandler(state, action.payload as string);
    })
    .addCase(fetchDashboardTasks.fulfilled, (state, action) => {
      state.loading = Loading.succeeded;
      state.tasks = action.payload || [];
      state.error = null;
    });
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  extraReducers: dashboardExtraReducers,
  reducers: {
    setWorkspaceId(state, action: PayloadAction<string | null>) {
      state.workspaceId = action.payload ?? null;
    },
    clearError(state) {
      state.error = null;
    },
    resetState: () => initialState,
  },
});

const persistConfig = {
  key: 'dashboard',
  storage,
  whitelist: ['workspaceId'],
};

export const { setWorkspaceId, clearError, resetState } = dashboardSlice.actions;
export default persistReducer(persistConfig, dashboardSlice.reducer);
