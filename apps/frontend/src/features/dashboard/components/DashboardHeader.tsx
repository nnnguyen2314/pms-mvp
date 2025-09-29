"use client";

import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/hooks';
import { getAuthState } from '@/features/auth/store/auth.selectors';

export type WorkspaceOption = { id: string; name: string };

export default function DashboardHeader({
  workspaceId,
  workspaces,
  onChangeWorkspace,
}: {
  workspaceId: string;
  workspaces: WorkspaceOption[];
  onChangeWorkspace: (id: string) => void;
}) {
  const router = useRouter();
  const { user } = useAppSelector(getAuthState);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const go = (path: string) => {
    handleClose();
    router.push(path);
  };

  const initials = React.useMemo(() => {
    const name = user?.name || user?.email || 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }, [user]);

  const handleWorkspaceChange = (e: SelectChangeEvent<string>) => {
    onChangeWorkspace(e.target.value as string);
  };

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ mb: 2 }}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Left: Workspace switcher */}
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="workspace-select-label">Workspace</InputLabel>
          <Select
            labelId="workspace-select-label"
            value={workspaceId}
            label="Workspace"
            onChange={handleWorkspaceChange}
          >
            {workspaces.map((ws) => (
              <MenuItem key={ws.id} value={ws.id}>
                {ws.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right: User avatar and menu */}
        <Box>
          <IconButton onClick={handleAvatarClick} size="small" sx={{ ml: 2 }} aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
            <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <MenuItem onClick={() => go('/profile')}>User Profile</MenuItem>
            <MenuItem onClick={() => go('/settings')}>Account Settings</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
