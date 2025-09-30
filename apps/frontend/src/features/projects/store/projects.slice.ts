import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/shared/store';
import { Project, ProjectFilters } from '../types';

export type ProjectsState = {
  items: Project[];
  loading: boolean;
  error: string | null;
  filters: ProjectFilters;
};

const initialState: ProjectsState = {
  items: [],
  loading: false,
  error: null,
  filters: { workspaceId: 'all', sortBy: 'created_at', sortDir: 'desc' },
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload; },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload; },
    setItems(state, action: PayloadAction<Project[]>) { state.items = action.payload; },
    upsertItem(state, action: PayloadAction<Project>) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload; else state.items.unshift(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) { state.items = state.items.filter(i => i.id !== action.payload); },
    setFilters(state, action: PayloadAction<ProjectFilters>) { state.filters = { ...state.filters, ...action.payload }; },
    resetFilters(state) { state.filters = { workspaceId: 'all', sortBy: 'created_at', sortDir: 'desc' }; },
  }
});

export const { setLoading, setError, setItems, upsertItem, removeItem, setFilters, resetFilters } = slice.actions;
export default slice.reducer;

export const selectProjects = (state: RootState) => state.projects.items;
export const selectProjectsLoading = (state: RootState) => state.projects.loading;
export const selectProjectsError = (state: RootState) => state.projects.error;
export const selectProjectFilters = (state: RootState) => state.projects.filters;
