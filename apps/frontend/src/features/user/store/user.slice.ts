import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { Loading, UserStore } from '@/shared/types';
import { doLogin } from '@/features/auth/store/auth.actions';
import { fetchUser, updateUser } from '@/features/user/store/user.actions';

export const initialState: UserStore = {
  user: null,
  loading: Loading.idle,
  error: null,
  successMessage: null,
};

const errorHandler = (state: UserStore, payload: string) => {
  state.loading = Loading.failed;
  state.error = payload;
  state.successMessage = null;
};

const userExtraReducers = (builder: ActionReducerMapBuilder<UserStore>) => {
  builder
    .addCase(fetchUser.pending, (state) => {
      state.loading = Loading.pending;
      state.successMessage = null;
      state.user = initialState.user;
      state.error = null;
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.user = initialState.user;
      errorHandler(state, action.payload as string);
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = Loading.succeeded;
      state.successMessage = 'Fetch user data Successfully';
      state.user = action.payload;
      state.error = null;
    })
    .addCase(updateUser.pending, (state) => {
      state.loading = Loading.pending;
      state.successMessage = null;
      state.error = null;
    })
    .addCase(updateUser.rejected, (state, action) => {
      errorHandler(state, action.payload as string);
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.loading = Loading.succeeded;
      state.successMessage = 'User updated successfully!';
      state.error = null;
    });
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: userExtraReducers,
  reducers: {
    clearMessages(state) {
      state.successMessage = null;
      state.error = null;
    },
    resetState: () => initialState,
  },
});

const persistConfig = {
  key: 'auth',
  storage,
};

export const { clearMessages, resetState } = userSlice.actions;
export default persistReducer(persistConfig, userSlice.reducer);
