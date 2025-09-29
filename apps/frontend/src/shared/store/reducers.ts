import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import authReducer from '@/features/auth/store/auth.slice';
import userReducer from '@/features/user/store/user.slice';
import notificationReducer from '@/shared/store/notification.slice';
import tasksReducer from '@/features/tasks/store/tasks.slice';
import dashboardReducer from '@/features/dashboard/store/dashboard.slice';

export const combinedReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  notification: notificationReducer,
  tasks: tasksReducer,
  dashboard: dashboardReducer,
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
