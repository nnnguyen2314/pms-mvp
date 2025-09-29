'use client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/shared/store';
import { clearNotification } from '@/shared/store/notification.slice';
import { Snackbar, Alert } from '@mui/material';

const SnackbarNotification = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state: RootState) => state.notification);

  const handleClose = () => {
    dispatch(clearNotification()); // ✅ Clear notification on close
  };

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Alert onClose={handleClose} severity={type || 'info'} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;
