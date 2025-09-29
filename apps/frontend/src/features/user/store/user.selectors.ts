import { createDraftSafeSelector } from '@reduxjs/toolkit';
import { RootState } from '@/shared/store';
import { initialState } from '@/features/user/store/user.slice';
import _ from 'lodash';

const stateKey = 'user';
const selectSelf = (state: RootState) => state;

export const getUserState = createDraftSafeSelector(selectSelf, (state: RootState) => {
  return _.get(state, stateKey, initialState);
});
