import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { axiosErrorHandler, ServerError } from '@/shared/store/helpers';
import { RootState } from '@/shared/store';
import api from '@/shared/api/axiosInstance';
import { logout, setUser } from '@/features/auth/store/auth.slice';

const requestErrorCatcher = (err: any, handler: { dispatch: any; rejectWithValue: any }) => {
  axiosErrorHandler(err, handler.dispatch);

  if (axios.isAxiosError(err)) {
    const axiosError = err as AxiosError<ServerError>;
    return handler.rejectWithValue(axiosError.response?.data.messages as string);
  } else {
    const error = err as Error;
    return handler.rejectWithValue(error.message as string);
  }
};

export const doLogin = createAsyncThunk<
  any,
  { email: string; password: string },
  { state: RootState }
>('auth/login', async (param, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await api.post('/auth/login', { email: param.email, password: param.password });
    // persist token to localStorage for axios interceptor
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('authToken', data.token); } catch {}
    }
    // also set user in store
    dispatch(setUser({ user: data.user, token: data.token }));
    return data; // { token, user }
  } catch (err) {
    return requestErrorCatcher(err, { dispatch, rejectWithValue });
  }
});

export const doRegister = createAsyncThunk<
  any,
  { name?: string; email: string; password: string; role?: string },
  { state: RootState }
>('auth/register', async (param, { rejectWithValue, dispatch }) => {
  try {
    const payload = { name: param.name, email: param.email, password: param.password, role: param.role || 'member' };
    const { data } = await api.post('/auth/register', payload);
    if (typeof window !== 'undefined') {
      try { if (data.token) localStorage.setItem('authToken', data.token); } catch {}
    }
    if (data?.user && data?.token) {
      dispatch(setUser({ user: data.user, token: data.token }));
    }
    return data;
  } catch (err) {
    return requestErrorCatcher(err, { dispatch, rejectWithValue });
  }
});

export const requestPasswordReset = createAsyncThunk<
  any,
  { email: string },
  { state: RootState }
>('auth/requestPasswordReset', async (param, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await api.post('/auth/forgot-password', { email: param.email });
    return data; // may contain message
  } catch (err) {
    return requestErrorCatcher(err, { dispatch, rejectWithValue });
  }
});

export const resetPassword = createAsyncThunk<
  any,
  { token: string; password: string },
  { state: RootState }
>('auth/resetPassword', async (param, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await api.post('/auth/reset-password', { token: param.token, password: param.password });
    return data;
  } catch (err) {
    return requestErrorCatcher(err, { dispatch, rejectWithValue });
  }
});

export const changePassword = createAsyncThunk<
  any,
  { currentPassword: string; newPassword: string },
  { state: RootState }
>('auth/changePassword', async (param, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await api.post('/auth/change-password', {
      currentPassword: param.currentPassword,
      newPassword: param.newPassword,
    });
    return data;
  } catch (err) {
    return requestErrorCatcher(err, { dispatch, rejectWithValue });
  }
});

export const fetchCurrentUser = createAsyncThunk<any, void, { state: RootState }>(
  'auth/fetchCurrentUser',
  async (_, { dispatch }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      if (!token) {
        dispatch(logout());
        return null;
      }
      const { data } = await api.get('/auth/me');
      if (data?.user) {
        dispatch(setUser({ user: data.user }));
        return data.user;
      } else {
        dispatch(logout());
        return null;
      }
    } catch (err) {
      dispatch(logout());
      return null;
    }
  }
);
