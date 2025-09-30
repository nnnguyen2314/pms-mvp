import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/shared/api/axiosInstance';
import { RootState } from '@/shared/store';
import { Workspace, WorkspaceFilters, WorkspaceStatus } from '../types';
import { setLoading, setError, setItems, upsertItem, removeItem } from './workspaces.slice';
import { axiosErrorHandler } from '@/shared/store/helpers';

const catchHandler = (err: any, { dispatch, rejectWithValue }: any) => {
  axiosErrorHandler(err, dispatch);
  return rejectWithValue(err?.response?.data?.message || err?.message || 'Request failed');
};

export const fetchWorkspaces = createAsyncThunk<Workspace[], Partial<WorkspaceFilters> | void, { state: RootState }>(
  'workspaces/fetchAll',
  async (filters, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const state = getState();
      const f = { ...state.workspaces.filters, ...(filters || {}) } as WorkspaceFilters;
      const params: any = {};
      if (f.status !== undefined) params.status = f.status;
      if (f.sortBy) params.sortBy = f.sortBy;
      if (f.sortDir) params.sortDir = f.sortDir;
      const { data } = await api.get('/workspaces', { params });
      const items: Workspace[] = data.items || [];
      dispatch(setItems(items));
      return items;
    } catch (err) {
      dispatch(setError('Failed to load workspaces'));
      return catchHandler(err, { dispatch, rejectWithValue });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createWorkspace = createAsyncThunk<Workspace, { name: string; description?: string; status?: WorkspaceStatus | null }, { state: RootState }>(
  'workspaces/create',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.post('/workspaces', payload);
      dispatch(upsertItem(data));
      return data;
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const updateWorkspace = createAsyncThunk<Workspace, { id: string; changes: Partial<Pick<Workspace, 'name' | 'description' | 'status'>> }, { state: RootState }>(
  'workspaces/update',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { id, changes } = payload;
      const { data } = await api.patch(`/workspaces/${id}`, changes);
      dispatch(upsertItem(data));
      return data;
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const deleteWorkspace = createAsyncThunk<string, { id: string }, { state: RootState }>(
  'workspaces/delete',
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/workspaces/${id}`);
      dispatch(removeItem(id));
      return id;
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const changeWorkspaceStatus = createAsyncThunk<Workspace, { id: string; status: WorkspaceStatus | null }, { state: RootState }>(
  'workspaces/changeStatus',
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/workspaces/${id}`, { status });
      dispatch(upsertItem(data));
      return data;
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const addWorkspaceMember = createAsyncThunk<void, { id: string; userId: string; role?: 'ADMIN'|'MEMBER'|'GUEST' }>(
  'workspaces/addMember',
  async ({ id, userId, role }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/workspaces/${id}/members`, { userId, role });
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const inviteWorkspaceMemberByEmail = createAsyncThunk<void, { id: string; email: string; role?: 'ADMIN'|'MEMBER'|'GUEST' }>(
  'workspaces/inviteByEmail',
  async ({ id, email, role }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/workspaces/${id}/invite`, { email, role });
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const removeWorkspaceMember = createAsyncThunk<void, { id: string; userId: string }>(
  'workspaces/removeMember',
  async ({ id, userId }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/workspaces/${id}/members/${userId}`);
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);
