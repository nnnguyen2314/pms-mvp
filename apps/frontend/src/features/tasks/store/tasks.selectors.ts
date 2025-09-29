import { RootState } from '@/shared/store';
import { TasksStore } from '@/features/tasks/store/tasks.slice';

export const getTasksState = (state: RootState): TasksStore => state.tasks as unknown as TasksStore;
export const getSelectedTaskId = (state: RootState) => getTasksState(state).selectedTaskId;
export const getLastViewedWorkspaceId = (state: RootState) => getTasksState(state).lastViewedWorkspaceId;
