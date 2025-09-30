'use client';

import React from 'react';
import {
  AppBar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
} from '@mui/material';

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

        {/* Right spacer (user menu moved to global header) */}
        <Box />
      </Toolbar>
    </AppBar>
  );
}
