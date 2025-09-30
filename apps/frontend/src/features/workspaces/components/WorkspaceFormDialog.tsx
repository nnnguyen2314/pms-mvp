"use client";
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField } from '@mui/material';
import { WorkspaceStatus } from '../types';

export default function WorkspaceFormDialog({
  open,
  onClose,
  title,
  form,
  setForm,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  form: { name: string; description?: string; status?: WorkspaceStatus | null };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description?: string; status?: WorkspaceStatus | null }>>;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Name" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} fullWidth />
          <TextField label="Description" value={form.description || ''} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} fullWidth multiline minRows={3} />
          <Select value={(form.status ?? '').toString()} onChange={(e) => {
            const v = e.target.value as string;
            setForm(s => ({ ...s, status: v === '' ? null : Number(v) as any }));
          }} displayEmpty>
            <MenuItem value="">No status</MenuItem>
            <MenuItem value={'1'}>Active</MenuItem>
            <MenuItem value={'0'}>Inactive</MenuItem>
            <MenuItem value={'2'}>Archived</MenuItem>
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
