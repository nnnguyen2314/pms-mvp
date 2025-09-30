import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/shared/api/axiosInstance';
import { RootState } from '@/shared/store';
import { axiosErrorHandler } from '@/shared/store/helpers';
import { Project, ProjectFilters, ProjectStatus } from '../types';
import { setLoading, setError, setItems, upsertItem, removeItem } from './projects.slice';

const catchHandler = (err: any, { dispatch, rejectWithValue }: any) => {
  axiosErrorHandler(err, dispatch);
  return rejectWithValue(err?.response?.data?.message || err?.message || 'Request failed');
};

export const fetchProjects = createAsyncThunk<Project[], Partial<ProjectFilters> | void, { state: RootState }>(
  'projects/fetchAll',
  async (filters, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const state = getState();
      const f = { ...state.projects.filters, ...(filters || {}) } as ProjectFilters;

      // If a specific workspace is selected, fetch only for that workspace
      const gather: Project[] = [];
      async function fetchForWorkspace(wsId: string) {
        const params: any = {};
        if (f.status !== undefined) params.status = f.status; // backend doesn't support yet, but keep for future
        const { data } = await api.get(`/workspaces/${wsId}/projects`, { params });
        (data.items || []).forEach((p: any) => gather.push(p));
      }

      if (f.workspaceId && f.workspaceId !== 'all') {
        await fetchForWorkspace(f.workspaceId);
      } else {
        // fetch for all current workspaces in store
        const workspaces = state.workspaces.items || [];
        for (const ws of workspaces) { // sequential to be gentle
          // eslint-disable-next-line no-await-in-loop
          await fetchForWorkspace(ws.id);
        }
      }

      // Sorting client-side
      const sortBy = f.sortBy || 'created_at';
      const dir = (f.sortDir || 'desc') === 'asc' ? 1 : -1;
      gather.sort((a: any, b: any) => {
        const av = a[sortBy] ?? '';
        const bv = b[sortBy] ?? '';
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });

      dispatch(setItems(gather));
      return gather;
    } catch (err) {
      dispatch(setError('Failed to load projects'));
      return catchHandler(err, { dispatch, rejectWithValue });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createProject = createAsyncThunk<Project, { workspaceId: string; name: string; description?: string; status?: ProjectStatus | null }, { state: RootState }>(
  'projects/create',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { workspaceId, ...body } = payload;
      const { data } = await api.post(`/workspaces/${workspaceId}/projects`, body);
      dispatch(upsertItem(data));
      return data;
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const updateProject = createAsyncThunk<Project, { id: string; changes: Partial<Pick<Project, 'name' | 'description' | 'status'>> }, { state: RootState }>(
  'projects/update',
  async ({ id, changes }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/projects/${id}`, changes);
      dispatch(upsertItem(data));
      return data;
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const deleteProject = createAsyncThunk<string, { id: string }, { state: RootState }>(
  'projects/delete',
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      dispatch(removeItem(id));
      return id;
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const addProjectMember = createAsyncThunk<void, { id: string; userId: string; role?: 'MEMBER'|'GUEST' }>(
  'projects/addMember',
  async ({ id, userId, role }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/projects/${id}/members`, { userId, role });
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const removeProjectMember = createAsyncThunk<void, { id: string; userId: string }>(
  'projects/removeMember',
  async ({ id, userId }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);
