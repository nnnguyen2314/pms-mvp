'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import useAppDispatch from '@/shared/hooks/useAppDispatch';
import useAppSelector from '@/shared/hooks/useAppSelector';
import { RootState } from '@/shared/store';
import { logout } from '@/features/auth/store/auth.slice';
import { getAuthState } from '@/features/auth/store/auth.selectors';

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(getAuthState);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        {user && (
          <>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {user.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
