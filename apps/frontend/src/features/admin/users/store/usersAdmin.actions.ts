import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/shared/store';
import { axiosErrorHandler } from '@/shared/store/helpers';
import { addUserToProject, addUserToWorkspace, deactivateUser, inviteUser, listUsers, removeUserFromProject, removeUserFromWorkspace, updateUserData } from '@/shared/api/user.api';
import { AdminUser } from './usersAdmin.slice';
import { setError, setItems, setLoading } from './usersAdmin.slice';

const catchHandler = (err: any, { dispatch, rejectWithValue }: any) => {
  axiosErrorHandler(err, dispatch);
  return rejectWithValue(err?.response?.data?.message || err?.message || 'Request failed');
};

export const fetchAdminUsers = createAsyncThunk<AdminUser[], void, { state: RootState }>(
  'adminUsers/fetchAll',
  async (_payload, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const { adminUsers } = getState();
      const f = adminUsers.filters;
      const params: any = { sortBy: f.sortBy, sortDir: f.sortDir };
      if (f.q) params.q = f.q;
      if (f.tab === 'unassigned') params.noWorkspace = true;
      else if (f.tab && f.tab !== 'all') params.workspaceId = f.tab;
      const data = await listUsers(params);
      dispatch(setItems(data || []));
      return data || [];
    } catch (err) {
      dispatch(setError('Failed to load users'));
      return catchHandler(err, { dispatch, rejectWithValue });
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const inviteAdminUser = createAsyncThunk<any, { email: string; name?: string }>(
  'adminUsers/invite',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await inviteUser(payload);
      // Reload list after invite
      await dispatch(fetchAdminUsers());
      return res;
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const updateAdminUser = createAsyncThunk<void, { id: string; changes: Partial<Pick<AdminUser, 'name' | 'email' | 'status'>> }>(
  'adminUsers/update',
  async ({ id, changes }, { dispatch, rejectWithValue }) => {
    try {
      await updateUserData(id, changes as any);
      await dispatch(fetchAdminUsers());
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const deactivateAdminUser = createAsyncThunk<void, { id: string }>(
  'adminUsers/deactivate',
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      await deactivateUser(id);
      await dispatch(fetchAdminUsers());
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const addUserToWorkspaceAdmin = createAsyncThunk<void, { userId: string; workspaceId: string; role?: 'ADMIN'|'MEMBER'|'GUEST' }>(
  'adminUsers/addToWorkspace',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await addUserToWorkspace({ userId: payload.userId, workspaceId: payload.workspaceId, workspaceRole: payload.role });
      await dispatch(fetchAdminUsers());
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const removeUserFromWorkspaceAdmin = createAsyncThunk<void, { userId: string; workspaceId: string }>(
  'adminUsers/removeFromWorkspace',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await removeUserFromWorkspace(payload);
      await dispatch(fetchAdminUsers());
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const addUserToProjectAdmin = createAsyncThunk<void, { userId: string; projectId: string; role?: 'MEMBER'|'GUEST' }>(
  'adminUsers/addToProject',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await addUserToProject({ userId: payload.userId, projectId: payload.projectId, projectRole: payload.role });
      await dispatch(fetchAdminUsers());
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);

export const removeUserFromProjectAdmin = createAsyncThunk<void, { userId: string; projectId: string }>(
  'adminUsers/removeFromProject',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await removeUserFromProject(payload);
      await dispatch(fetchAdminUsers());
    } catch (err) {
      return catchHandler(err, { dispatch, rejectWithValue });
    }
  }
);
