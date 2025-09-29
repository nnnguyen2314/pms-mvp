export enum Loading {
  idle = 'idle',
  pending = 'pending',
  succeeded = 'succeeded',
  failed = 'failed',
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  status?: number;
}

export interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  error: any;
  loading: Loading;
  isAuthenticated: boolean;
}

export interface UserStore {
  user: any | null;
  loading: Loading | null;
  error: string | null;
  successMessage: string | null;
}
