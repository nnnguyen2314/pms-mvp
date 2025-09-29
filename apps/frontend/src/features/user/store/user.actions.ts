import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { axiosErrorHandler, ServerError } from '@/shared/store/helpers';
import { fetchUserData, updateUserData } from '@/shared/api/user.api';
import { RootState } from '@/shared/store';

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

export const fetchUser = createAsyncThunk<any, { userId: string }, { state: RootState }>(
  'user/fetchUser',
  async (param, { rejectWithValue, dispatch }) => {
    try {
      return await fetchUserData(param?.userId);
    } catch (err: any) {
      requestErrorCatcher(err, { dispatch, rejectWithValue });
    }
  }
);

export const updateUser = createAsyncThunk<
  any,
  { userId: string; data: any },
  { state: RootState }
>('user/updateUser', async (param, { rejectWithValue, dispatch }) => {
  try {
    return await updateUserData(param?.userId, param?.data);
  } catch (err: any) {
    requestErrorCatcher(err, { dispatch, rejectWithValue });
  }
});
