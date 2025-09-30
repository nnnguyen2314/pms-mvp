import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import authReducer from '@/features/auth/store/auth.slice';
import notificationReducer from '@/shared/store/notification.slice';
import tasksReducer from '@/features/tasks/store/tasks.slice';
import dashboardReducer from '@/features/dashboard/store/dashboard.slice';
import workspacesReducer from '@/features/workspaces/store/workspaces.slice';
import projectsReducer from '@/features/projects/store/projects.slice';
import adminUsersReducer from '@/features/admin/users/store/usersAdmin.slice';

export const combinedReducer = combineReducers({
  auth: authReducer,
  notification: notificationReducer,
  tasks: tasksReducer,
  dashboard: dashboardReducer,
  workspaces: workspacesReducer,
  projects: projectsReducer,
  adminUsers: adminUsersReducer,
});

const reducers = (state: ReturnType<typeof combinedReducer>, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export default reducers;
