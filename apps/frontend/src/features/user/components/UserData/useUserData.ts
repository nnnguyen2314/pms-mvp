import { useCallback } from 'react';
import useAppDispatch from '@/shared/hooks/useAppDispatch';
import { fetchUser, updateUser } from '@/features/user/store/user.actions';
import { showNotification } from '@/shared/store/notification.slice';
import useAppSelector from '@/shared/hooks/useAppSelector';
import { getUserState } from '@/features/user/store/user.selectors';
import { clearMessages } from '@/features/user/store/user.slice';

export const useUserData = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error, successMessage } = useAppSelector(getUserState);

  const handleFetchUserData = useCallback(
    async (userId: any) => {
      try {
        await dispatch(fetchUser({ userId: userId }));
      } catch (err) {
        console.error('Failed to fetch user data', err);
        dispatch(showNotification({ message: error || err, type: 'error' }));
      }
    },
    [dispatch]
  );

  const handleUpdateUserData = useCallback(
    async (userId: any, data: any) => {
      try {
        await dispatch(updateUser({ userId, data }));
        dispatch(showNotification({ message: successMessage, type: 'success' }));
        setTimeout(() => {
          dispatch(clearMessages());
        }, 4000);
      } catch (err) {
        console.error('Failed to update user data', err);
        dispatch(showNotification({ message: error || err, type: 'error' }));
      }
    },
    [dispatch]
  );

  return { user, loading, handleFetchUserData, handleUpdateUserData };
};
