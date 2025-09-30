"use client";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/shared/store';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { createWorkspace, deleteWorkspace, fetchWorkspaces, updateWorkspace, inviteWorkspaceMemberByEmail, addWorkspaceMember } from '../store/workspaces.actions';
import { selectWorkspaces, selectWorkspaceFilters, selectWorkspacesLoading } from '../store/workspaces.slice';
import { Workspace, WorkspaceStatus } from '../types';

function statusLabel(s: WorkspaceStatus | null | undefined) {
  if (s === 0) return 'Inactive';
  if (s === 1) return 'Active';
  if (s === 2) return 'Archived';
  return '—';
}

export default function WorkspacesManager() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectWorkspaces);
  const filters = useSelector(selectWorkspaceFilters);
  const loading = useSelector(selectWorkspacesLoading);

  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Workspace | null>(null);
  const [form, setForm] = React.useState<{ name: string; description?: string; status?: WorkspaceStatus | null }>({ name: '' });

  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [invite, setInvite] = React.useState<{ id?: string; email: string; role: 'ADMIN'|'MEMBER'|'GUEST' }>({ email: '', role: 'MEMBER' });

  const [addOpen, setAddOpen] = React.useState(false);
  const [addMemberState, setAddMemberState] = React.useState<{ id?: string; userId: string; role: 'ADMIN'|'MEMBER'|'GUEST' }>({ userId: '', role: 'MEMBER' });

  React.useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch, filters.status, filters.sortBy, filters.sortDir]);

  const onCreate = () => { setEditing(null); setForm({ name: '', description: '', status: 1 }); setOpenForm(true); };
  const onEdit = (ws: Workspace) => { setEditing(ws); setForm({ name: ws.name, description: ws.description || '', status: (ws.status ?? null) as any }); setOpenForm(true); };
  const onSubmit = async () => {
    if (!form.name?.trim()) return;
    if (editing) {
      await dispatch(updateWorkspace({ id: editing.id, changes: { name: form.name, description: form.description, status: form.status ?? null } }));
    } else {
      await dispatch(createWorkspace({ name: form.name, description: form.description, status: form.status ?? 1 }));
    }
    setOpenForm(false);
  };

  const onDelete = async (ws: Workspace) => {
    if (confirm(`Delete workspace "${ws.name}"? This cannot be undone.`)) {
      await dispatch(deleteWorkspace({ id: ws.id }));
    }
  };

  const onInvite = (ws: Workspace) => { setInvite({ id: ws.id, email: '', role: 'MEMBER' }); setInviteOpen(true); };
  const onInviteSubmit = async () => {
    if (!invite.id || !invite.email) return;
    await dispatch(inviteWorkspaceMemberByEmail({ id: invite.id, email: invite.email, role: invite.role }));
    setInviteOpen(false);
  };

  const onAdd = (ws: Workspace) => { setAddMemberState({ id: ws.id, userId: '', role: 'MEMBER' }); setAddOpen(true); };
  const onAddSubmit = async () => {
    if (!addMemberState.id || !addMemberState.userId) return;
    await dispatch(addWorkspaceMember({ id: addMemberState.id, userId: addMemberState.userId, role: addMemberState.role }));
    setAddOpen(false);
  };

  const handleSort = (col: 'name'|'status'|'created_at'|'updated_at') => {
    const dir = (filters.sortBy === col && filters.sortDir === 'asc') ? 'desc' : 'asc';
    // dispatch setFilters directly via store slice action
    dispatch({ type: 'workspaces/setFilters', payload: { sortBy: col, sortDir: dir } });
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Workspace Management</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Status</Typography>
            <Select size="small" value={(filters.status ?? '').toString()} onChange={(e) => {
              const v = e.target.value;
              const parsed = v === '' ? undefined : (v === 'null' ? null : Number(v));
              dispatch({ type: 'workspaces/setFilters', payload: { status: parsed } });
            }} style={{ minWidth: 140 }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value={"1"}>Active</MenuItem>
              <MenuItem value={"0"}>Inactive</MenuItem>
              <MenuItem value={"2"}>Archived</MenuItem>
              <MenuItem value={"null"}>No status</MenuItem>
            </Select>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>New Workspace</Button>
        </Stack>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status</TableCell>
            <TableCell onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>Created</TableCell>
            <TableCell onClick={() => handleSort('updated_at')} style={{ cursor: 'pointer' }}>Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((ws: any) => (
            <TableRow key={ws.id} hover>
              <TableCell>{ws.name}</TableCell>
              <TableCell>{ws.description}</TableCell>
              <TableCell>
                <Chip label={statusLabel(ws.status ?? null)} size="small" />
              </TableCell>
              <TableCell>{new Date(ws.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(ws.updatedAt).toLocaleString()}</TableCell>
              <TableCell align="right">
                <Tooltip title="Add existing user">
                  <IconButton size="small" onClick={() => onAdd(ws)}><PersonAddAlt1Icon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Invite member by email">
                  <IconButton size="small" onClick={() => onInvite(ws)}><GroupAddIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(ws)}><EditIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => onDelete(ws)}><DeleteIcon fontSize="small" /></IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Workspace' : 'New Workspace'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} fullWidth />
            <TextField label="Description" value={form.description || ''} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} fullWidth multiline minRows={3} />
            <Select value={(form.status ?? '').toString()} onChange={(e) => {
              const v = e.target.value as string;
              setForm(s => ({ ...s, status: v === '' ? null : Number(v) as any }));
            }} displayEmpty>
              <MenuItem value="">No status</MenuItem>
              <MenuItem value={"1"}>Active</MenuItem>
              <MenuItem value={"0"}>Inactive</MenuItem>
              <MenuItem value={"2"}>Archived</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={onSubmit}>{editing ? 'Save' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Existing User to Workspace</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="User ID" value={addMemberState.userId} onChange={e => setAddMemberState(s => ({ ...s, userId: e.target.value }))} fullWidth />
            <Select value={addMemberState.role} onChange={(e) => setAddMemberState(s => ({ ...s, role: e.target.value as any }))}>
              <MenuItem value={'MEMBER'}>Member</MenuItem>
              <MenuItem value={'ADMIN'}>Admin</MenuItem>
              <MenuItem value={'GUEST'}>Guest</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onAddSubmit}>Add member</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} fullWidth maxWidth="xs">
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
          <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onInviteSubmit}>Send invite</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
