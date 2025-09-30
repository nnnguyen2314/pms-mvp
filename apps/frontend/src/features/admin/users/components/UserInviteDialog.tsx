"use client";
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';

export type UserInviteDialogProps = {
  open: boolean;
  email: string;
  name?: string;
  onChange: (data: { email: string; name?: string }) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function UserInviteDialog(props: UserInviteDialogProps) {
  const { open, email, name, onChange, onClose, onSubmit } = props;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Invite User</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField type="email" label="Email" value={email} onChange={e => onChange({ email: e.target.value, name })} fullWidth />
          <TextField label="Name (optional)" value={name || ''} onChange={e => onChange({ email, name: e.target.value })} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>Send invite</Button>
      </DialogActions>
    </Dialog>
  );
}
