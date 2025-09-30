import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/shared/store';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  last_login?: string | null;
  workspaces?: string[];
  projects?: string[];
};

export type UsersAdminFilters = {
  q?: string;
  tab?: string; // 'all' | 'unassigned' | workspaceId
  sortBy?: 'name' | 'email' | 'created_at' | 'updated_at' | 'last_login' | 'project_name' | 'status';
  sortDir?: 'asc' | 'desc';
};

export type UsersAdminState = {
  items: AdminUser[];
  loading: boolean;
  error: string | null;
  filters: UsersAdminFilters;
};

const initialState: UsersAdminState = {
  items: [],
  loading: false,
  error: null,
  filters: { sortBy: 'created_at', sortDir: 'desc', tab: 'all', q: '' },
};

const usersAdminSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload; },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload; },
    setItems(state, action: PayloadAction<AdminUser[]>) { state.items = action.payload; },
    setFilters(state, action: PayloadAction<Partial<UsersAdminFilters>>) { state.filters = { ...state.filters, ...action.payload }; },
    resetFilters(state) { state.filters = { sortBy: 'created_at', sortDir: 'desc', tab: 'all', q: '' }; },
  }
});

export const { setLoading, setError, setItems, setFilters, resetFilters } = usersAdminSlice.actions;
export default usersAdminSlice.reducer;

export const selectAdminUsers = (state: RootState) => state.adminUsers.items;
export const selectAdminUsersLoading = (state: RootState) => state.adminUsers.loading;
export const selectAdminUsersError = (state: RootState) => state.adminUsers.error;
export const selectAdminUsersFilters = (state: RootState) => state.adminUsers.filters;
