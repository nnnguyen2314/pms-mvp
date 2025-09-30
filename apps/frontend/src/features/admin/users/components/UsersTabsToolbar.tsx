"use client";
import React from 'react';
import { Stack, Button, TextField, Tabs, Tab, Typography } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export type UsersTabsToolbarProps = {
  title?: string;
  q: string;
  onQChange: (q: string) => void;
  onInviteClick: () => void;
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
};

export default function UsersTabsToolbar(props: UsersTabsToolbarProps) {
  const { title = 'Admin - Users', q, onQChange, onInviteClick, tabs, value, onChange } = props;
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">{title}</Typography>
        <Stack direction="row" spacing={2}>
          <TextField size="small" placeholder="Search name/email" value={q} onChange={(e) => onQChange(e.target.value)} />
          <Button variant="contained" startIcon={<GroupAddIcon />} onClick={onInviteClick}>Invite User</Button>
        </Stack>
      </Stack>
      <Tabs value={value} onChange={(e, v) => onChange(v)} sx={{ mb: 2 }} variant="scrollable" scrollButtons="auto">
        {tabs.map(t => (<Tab key={t.value} label={t.label} value={t.value} />))}
      </Tabs>
    </>
  );
}
