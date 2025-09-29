import { RootState } from '@/shared/store';

export const getDashboardState = (state: RootState) => (state as any).dashboard;
export const getDashboardWorkspaceId = (state: RootState) => getDashboardState(state)?.workspaceId as string | null;
export const getDashboardTasks = (state: RootState) => getDashboardState(state)?.tasks || [];
export const getDashboardLoading = (state: RootState) => getDashboardState(state)?.loading;
export const getDashboardError = (state: RootState) => getDashboardState(state)?.error;
