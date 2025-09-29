import { createDraftSafeSelector } from '@reduxjs/toolkit';
import { RootState } from '@/shared/store';
import { initialState } from '@/features/auth/store/auth.slice';
import _ from 'lodash';

const stateKey = 'auth';
const selectSelf = (state: RootState) => state;

export const getAuthState = createDraftSafeSelector(selectSelf, (state: RootState) => {
  return _.get(state, stateKey, initialState);
});
