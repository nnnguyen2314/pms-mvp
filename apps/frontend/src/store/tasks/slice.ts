import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TaskState = {
  byId: Record<string, { id: string; title: string; status: string; assigneeId?: string }>
};

const initialState: TaskState = {
  byId: {},
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    upsertMany(state, action: PayloadAction<TaskState['byId']>) {
      state.byId = { ...state.byId, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const { upsertMany, reset } = tasksSlice.actions;
export default tasksSlice.reducer;
