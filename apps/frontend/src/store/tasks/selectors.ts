import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/shared/store';

export const selectTasksState = (state: RootState) => state.tasks;

export const selectAllTasks = createSelector(selectTasksState, (s) => Object.values(s.byId));
