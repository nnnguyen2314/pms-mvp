import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { AuthStore, Loading } from '@/shared/types';
import { doLogin, doRegister } from '@/features/auth/store/auth.actions';

export const initialState: AuthStore = {
  token: null,
  user: null,
  error: undefined,
  loading: Loading.idle,
  isAuthenticated: false,
  effectiveRole: null,
  permissions: [],
};

const errorHandler = (state: AuthStore, payload: string) => {
  state.loading = Loading.failed;
  state.error = payload;
};

const authExtraReducers = (builder: ActionReducerMapBuilder<AuthStore>) => {
  builder
    .addCase(doLogin.pending, (state) => {
      state.loading = Loading.pending;
      state.isAuthenticated = false;
      state.user = initialState.user;
      state.error = undefined;
    })
    .addCase(doLogin.rejected, (state, action) => {
      state.loading = Loading.failed;
      state.isAuthenticated = false;
      state.user = initialState.user;
      errorHandler(state, action.payload as string);
    })
    .addCase(doLogin.fulfilled, (state, action) => {
      state.loading = Loading.succeeded;
      state.isAuthenticated = true;
      state.token = action.payload?.token || null;
      state.user = action.payload?.user || null;
      state.error = undefined;
    })
    .addCase(doRegister.pending, (state) => {
      state.loading = Loading.pending;
      state.error = undefined;
    })
    .addCase(doRegister.rejected, (state, action) => {
      state.loading = Loading.failed;
      errorHandler(state, action.payload as string);
    })
    .addCase(doRegister.fulfilled, (state, action) => {
      state.loading = Loading.succeeded;
      // If backend returns token & user, set authenticated; otherwise keep current state
      state.token = action.payload?.token || state.token;
      state.user = action.payload?.user || state.user;
      state.isAuthenticated = !!state.user && !!state.token;
      state.error = undefined;
    });
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: authExtraReducers,
  reducers: {
    setUser(state, action: PayloadAction<{ user: any; token?: string } | null>) {
      state.user = action?.payload?.user || null;
      state.token = action?.payload?.token || state.token;
      state.isAuthenticated = !!state.user && !!state.token;
      if (typeof window !== 'undefined') {
        try {
          if (state.token) localStorage.setItem('authToken', state.token);
        } catch {}
      }
    },
    setPermissions(state, action: PayloadAction<{ effectiveRole: 'ADMIN'|'OWNER'|'MEMBER' | null; permissions: string[] }>) {
      state.effectiveRole = action.payload.effectiveRole;
      state.permissions = action.payload.permissions || [];
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.effectiveRole = null;
      state.permissions = [];
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem('authToken'); } catch {}
      }
    },
    resetState: () => initialState,
  },
});

const persistConfig = {
  key: 'auth',
  storage,
};

export const { logout, setUser, setPermissions } = authSlice.actions;
export default persistReducer(persistConfig, authSlice.reducer);
