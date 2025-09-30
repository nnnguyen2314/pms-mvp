"use client";
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField } from '@mui/material';

export type MembershipDialogProps = {
  open: boolean;
  mode: 'add-ws'|'remove-ws'|'add-prj'|'remove-prj';
  workspaces: { id: string; name: string }[];
  workspaceId?: string;
  projectId?: string;
  role?: 'ADMIN'|'MEMBER'|'GUEST';
  onChange: (data: { workspaceId?: string; projectId?: string; role?: 'ADMIN'|'MEMBER'|'GUEST' }) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function MembershipDialog(props: MembershipDialogProps) {
  const { open, mode, workspaces, workspaceId, projectId, role = 'MEMBER', onChange, onClose, onSubmit } = props;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Manage Membership</DialogTitle>
      <DialogContent>
        {mode === 'add-ws' || mode === 'remove-ws' ? (
          <Stack spacing={2} mt={1}>
            <Select displayEmpty value={workspaceId || ''} onChange={(e) => onChange({ workspaceId: e.target.value as string })}>
              <MenuItem value="" disabled>Select workspace</MenuItem>
              {workspaces.map((w) => (<MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>))}
            </Select>
            {mode === 'add-ws' && (
              <Select value={role} onChange={(e) => onChange({ role: e.target.value as any })}>
                <MenuItem value={'MEMBER'}>Member</MenuItem>
                <MenuItem value={'ADMIN'}>Admin</MenuItem>
                <MenuItem value={'GUEST'}>Guest</MenuItem>
              </Select>
            )}
          </Stack>
        ) : (
          <Stack spacing={2} mt={1}>
            <TextField label="Project ID" value={projectId || ''} onChange={(e) => onChange({ projectId: e.target.value })} fullWidth />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}
