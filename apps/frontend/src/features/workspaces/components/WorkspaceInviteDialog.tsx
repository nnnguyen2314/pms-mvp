"use client";
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField } from '@mui/material';

export default function WorkspaceInviteDialog({
  open,
  onClose,
  invite,
  setInvite,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  invite: { id?: string; email: string; role: 'ADMIN'|'MEMBER'|'GUEST' };
  setInvite: React.Dispatch<React.SetStateAction<{ id?: string; email: string; role: 'ADMIN'|'MEMBER'|'GUEST' }>>;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Invite to Workspace</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField type="email" label="Email" value={invite.email} onChange={e => setInvite(s => ({ ...s, email: e.target.value }))} fullWidth />
          <Select value={invite.role} onChange={(e) => setInvite(s => ({ ...s, role: e.target.value as any }))}>
            <MenuItem value={'MEMBER'}>Member</MenuItem>
            <MenuItem value={'ADMIN'}>Admin</MenuItem>
            <MenuItem value={'GUEST'}>Guest</MenuItem>
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>Send invite</Button>
      </DialogActions>
    </Dialog>
  );
}
