"use client";
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField } from '@mui/material';

export type UserEditDialogProps = {
  open: boolean;
  name: string;
  email: string;
  status: number;
  onChange: (data: { name?: string; email?: string; status?: number }) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function UserEditDialog(props: UserEditDialogProps) {
  const { open, name, email, status, onChange, onClose, onSubmit } = props;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Name" value={name || ''} onChange={e => onChange({ name: e.target.value })} fullWidth />
          <TextField type="email" label="Email" value={email || ''} onChange={e => onChange({ email: e.target.value })} fullWidth />
          <Select value={String(status ?? 1)} onChange={(e) => onChange({ status: Number(e.target.value) })}>
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
            <MenuItem value={2}>Disabled</MenuItem>
            <MenuItem value={3}>Reactivated</MenuItem>
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
