'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Divider, ListItemText, Tooltip, Box, Button, Stack } from '@mui/material';
import useAppDispatch from '@/shared/hooks/useAppDispatch';
import useAppSelector from '@/shared/hooks/useAppSelector';
import { logout } from '@/features/auth/store/auth.slice';
import { getAuthState } from '@/features/auth/store/auth.selectors';
import { fetchPermissions } from '@/features/auth/store/auth.actions';

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, effectiveRole } = useAppSelector(getAuthState) as any;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    router.push('/login');
  };

  const initials = React.useMemo(() => {
    if (!user) return '';
    const source = (user.name && String(user.name)) || String(user.email || '');
    const parts = source.split(/[\s@._-]+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchPermissions());
    }
  }, [user, dispatch]);

  const goto = (path: string) => router.push(path);

  const MenuButtons = () => {
    if (!user) return null;
    const role = effectiveRole as 'ADMIN'|'OWNER'|'MEMBER' | null;
    const common = [
      <Button key="tasks" color="inherit" onClick={() => goto('/tasks')}>Tasks</Button>,
    ];
    if (role === 'ADMIN') {
      return (
        <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
          <Button color="inherit" onClick={() => goto('/workspaces')}>Workspaces</Button>
          <Button color="inherit" onClick={() => goto('/projects')}>Projects</Button>
          {common}
          <Button color="inherit" onClick={() => goto('/members')}>Members</Button>
        </Stack>
      );
    }
    if (role === 'OWNER') {
      return (
        <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
          <Button color="inherit" onClick={() => goto('/projects')}>Projects</Button>
          {common}
          <Button color="inherit" onClick={() => goto('/members')}>Members</Button>
        </Stack>
      );
    }
    // MEMBER
    return (
      <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
        {common}
      </Stack>
    );
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#0D47A1', color: '#ffffff' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 2 }}>
          PM SaaS
        </Typography>
        {user && <MenuButtons />}
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <Box>
            <Tooltip title={user.email || 'Account'}>
              <IconButton
                onClick={handleAvatarClick}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                color="inherit"
              >
                <Avatar sx={{ width: 40, height: 40, fontSize: 16, bgcolor: '#ffffff', color: '#0D47A1' }}>{initials || '?'}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled>
                <ListItemText
                  primary={user.email}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => router.push('/profile')}>
                <ListItemText primary="User Profile" />
              </MenuItem>
              <MenuItem onClick={() => router.push('/settings')}>
                <ListItemText primary="Account Settings" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
