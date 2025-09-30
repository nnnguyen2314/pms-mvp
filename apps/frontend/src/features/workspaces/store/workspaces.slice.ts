import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workspace, WorkspaceFilters } from '../types';
import { RootState } from '@/shared/store';

export type WorkspacesState = {
  items: Workspace[];
  loading: boolean;
  error: string | null;
  filters: WorkspaceFilters;
};

const initialState: WorkspacesState = {
  items: [],
  loading: false,
  error: null,
  filters: { sortBy: 'created_at', sortDir: 'desc' },
};

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setItems(state, action: PayloadAction<Workspace[]>) {
      state.items = action.payload;
    },
    upsertItem(state, action: PayloadAction<Workspace>) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    setFilters(state, action: PayloadAction<WorkspaceFilters>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = { sortBy: 'created_at', sortDir: 'desc' };
    }
  }
});

export const { setLoading, setError, setItems, upsertItem, removeItem, setFilters, resetFilters } = workspacesSlice.actions;
export default workspacesSlice.reducer;

export const selectWorkspaces = (state: RootState) => state.workspaces.items;
export const selectWorkspacesLoading = (state: RootState) => state.workspaces.loading;
export const selectWorkspacesError = (state: RootState) => state.workspaces.error;
export const selectWorkspaceFilters = (state: RootState) => state.workspaces.filters;
