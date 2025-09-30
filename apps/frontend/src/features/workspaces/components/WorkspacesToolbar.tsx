"use client";
import React from 'react';
import { Button, MenuItem, Select, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function WorkspacesToolbar({
  statusValue,
  onStatusChange,
  onCreate,
}: {
  statusValue: string;
  onStatusChange: (value: string) => void;
  onCreate: () => void;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography variant="h5">Workspace Management</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">Status</Typography>
          <Select size="small" value={statusValue} onChange={(e) => onStatusChange(e.target.value as string)} style={{ minWidth: 140 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value={'1'}>Active</MenuItem>
            <MenuItem value={'0'}>Inactive</MenuItem>
            <MenuItem value={'2'}>Archived</MenuItem>
            <MenuItem value={'null'}>No status</MenuItem>
          </Select>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>New Workspace</Button>
      </Stack>
    </Stack>
  );
}
