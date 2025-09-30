"use client";
import React from 'react';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Stack, Tab, Tabs, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { fetchWorkspaces } from '@/features/workspaces/store/workspaces.actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/shared/store';
import { selectWorkspaces } from '@/features/workspaces/store/workspaces.slice';
import { selectAdminUsers, selectAdminUsersFilters, selectAdminUsersLoading, setFilters } from './store/usersAdmin.slice';
import { addUserToProjectAdmin, addUserToWorkspaceAdmin, deactivateAdminUser, fetchAdminUsers, inviteAdminUser, removeUserFromProjectAdmin, removeUserFromWorkspaceAdmin, updateAdminUser } from './store/usersAdmin.actions';

function statusLabel(s: number | null | undefined) {
  if (s === 0) return 'Inactive';
  if (s === 1) return 'Active';
  if (s === 2) return 'Disabled';
  if (s === 3) return 'Reactivated';
  return '—';
}

type ListedUser = {
  id: string;
  name: string;
  email: string;
  status: number;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  workspaces?: string[];
  projects?: string[];
};

export default function UsersAdminManager() {
  const dispatch = useDispatch<AppDispatch>();
  const workspaces = useSelector(selectWorkspaces);

  const filters = useSelector(selectAdminUsersFilters);
  const items = useSelector(selectAdminUsers) as any as ListedUser[];
  const loading = useSelector(selectAdminUsersLoading);

  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [invite, setInvite] = React.useState<{ email: string; name?: string }>({ email: '' });

  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Partial<ListedUser> | null>(null);

  const [membershipOpen, setMembershipOpen] = React.useState(false);
  const [membership, setMembership] = React.useState<{ userId: string; workspaceId?: string; projectId?: string; mode: 'add-ws'|'remove-ws'|'add-prj'|'remove-prj'; role?: 'ADMIN'|'MEMBER'|'GUEST' } | null>(null);

  React.useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch, filters.q, filters.sortBy, filters.sortDir, filters.tab]);

  const handleSort = (col: NonNullable<typeof filters.sortBy>) => {
    const dir = (filters.sortBy === col && filters.sortDir === 'asc') ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: col, sortDir: dir }));
  };

  const onInviteSubmit = async () => {
    if (!invite.email) return;
    await dispatch(inviteAdminUser(invite));
    setInviteOpen(false);
    setInvite({ email: '' });
  };

  const onDeactivate = async (u: ListedUser) => {
    if (!confirm(`Deactivate ${u.email}?`)) return;
    await dispatch(deactivateAdminUser({ id: u.id }));
  };

  const onEdit = (u: ListedUser) => { setEditing({ ...u }); setEditOpen(true); };
  const onEditSubmit = async () => {
    if (!editing?.id) return;
    await dispatch(updateAdminUser({ id: editing.id, changes: { name: editing.name as any, email: editing.email as any, status: editing.status as any } }));
    setEditOpen(false);
    setEditing(null);
  };

  const openMembership = (u: ListedUser, mode: 'add-ws'|'remove-ws'|'add-prj'|'remove-prj') => {
    setMembership({ userId: u.id, mode });
    setMembershipOpen(true);
  };
  const submitMembership = async () => {
    if (!membership) return;
    const { mode, userId, workspaceId, projectId, role } = membership;
    if (mode === 'add-ws' && userId && workspaceId) await dispatch(addUserToWorkspaceAdmin({ userId, workspaceId, role: role || 'MEMBER' }));
    if (mode === 'remove-ws' && userId && workspaceId) await dispatch(removeUserFromWorkspaceAdmin({ userId, workspaceId }));
    if (mode === 'add-prj' && userId && projectId) await dispatch(addUserToProjectAdmin({ userId, projectId, role: 'MEMBER' }));
    if (mode === 'remove-prj' && userId && projectId) await dispatch(removeUserFromProjectAdmin({ userId, projectId }));
    setMembershipOpen(false);
    setMembership(null);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Admin - Users</Typography>
        <Stack direction="row" spacing={2}>
          <TextField size="small" placeholder="Search name/email" value={filters.q || ''} onChange={(e) => dispatch(setFilters({ q: e.target.value }))} />
          <Button variant="contained" startIcon={<GroupAddIcon />} onClick={() => setInviteOpen(true)}>Invite User</Button>
        </Stack>
      </Stack>

      <Tabs value={filters.tab || 'all'} onChange={(e, v) => dispatch(setFilters({ tab: v }))} sx={{ mb: 2 }} variant="scrollable" scrollButtons="auto">
        <Tab label={`All`} value="all" />
        <Tab label={`Unassigned`} value="unassigned" />
        {workspaces.map((w: any) => (
          <Tab key={w.id} label={w.name} value={w.id} />
        ))}
      </Tabs>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name</TableCell>
            <TableCell onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email</TableCell>
            <TableCell onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status</TableCell>
            <TableCell>Workspaces</TableCell>
            <TableCell onClick={() => handleSort('project_name')} style={{ cursor: 'pointer' }}>Projects</TableCell>
            <TableCell onClick={() => handleSort('last_login')} style={{ cursor: 'pointer' }}>Last login</TableCell>
            <TableCell onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>Created</TableCell>
            <TableCell onClick={() => handleSort('updated_at')} style={{ cursor: 'pointer' }}>Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(u => (
            <TableRow key={u.id} hover>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell><Chip size="small" label={statusLabel(u.status)} /></TableCell>
              <TableCell>{(u.workspaces||[]).join(', ')}</TableCell>
              <TableCell>{(u.projects||[]).join(', ')}</TableCell>
              <TableCell>{u.last_login ? new Date(u.last_login).toLocaleString() : '—'}</TableCell>
              <TableCell>{u.created_at ? new Date(u.created_at).toLocaleString() : '—'}</TableCell>
              <TableCell>{u.updated_at ? new Date(u.updated_at).toLocaleString() : '—'}</TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(u)}><EditIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Deactivate">
                  <IconButton size="small" color="error" onClick={() => onDeactivate(u)}><DeleteIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Add to workspace">
                  <IconButton size="small" onClick={() => openMembership(u, 'add-ws')}><PersonAddAlt1Icon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Remove from workspace">
                  <IconButton size="small" onClick={() => openMembership(u, 'remove-ws')}><RemoveCircleOutlineIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Add to project">
                  <IconButton size="small" onClick={() => openMembership(u, 'add-prj')}><PlaylistAddIcon fontSize="small" /></IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField type="email" label="Email" value={invite.email} onChange={e => setInvite(s => ({ ...s, email: e.target.value }))} fullWidth />
            <TextField label="Name (optional)" value={invite.name || ''} onChange={e => setInvite(s => ({ ...s, name: e.target.value }))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onInviteSubmit}>Send invite</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" value={editing?.name || ''} onChange={e => setEditing(s => ({ ...(s||{}), name: e.target.value }))} fullWidth />
            <TextField type="email" label="Email" value={editing?.email || ''} onChange={e => setEditing(s => ({ ...(s||{}), email: e.target.value }))} fullWidth />
            <Select value={String(editing?.status ?? 1)} onChange={(e) => setEditing(s => ({ ...(s||{}), status: Number(e.target.value) as any }))}>
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
              <MenuItem value={2}>Disabled</MenuItem>
              <MenuItem value={3}>Reactivated</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={membershipOpen} onClose={() => setMembershipOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Manage Membership</DialogTitle>
        <DialogContent>
          {membership?.mode === 'add-ws' || membership?.mode === 'remove-ws' ? (
            <Stack spacing={2} mt={1}>
              <Select displayEmpty value={membership?.workspaceId || ''} onChange={(e) => setMembership(s => ({ ...(s as any), workspaceId: e.target.value as string }))}>
                <MenuItem value="" disabled>Select workspace</MenuItem>
                {workspaces.map((w: any) => (<MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>))}
              </Select>
              {membership?.mode === 'add-ws' && (
                <Select value={membership?.role || 'MEMBER'} onChange={(e) => setMembership(s => ({ ...(s as any), role: e.target.value as any }))}>
                  <MenuItem value={'MEMBER'}>Member</MenuItem>
                  <MenuItem value={'ADMIN'}>Admin</MenuItem>
                  <MenuItem value={'GUEST'}>Guest</MenuItem>
                </Select>
              )}
            </Stack>
          ) : (
            <Stack spacing={2} mt={1}>
              <TextField label="Project ID" value={membership?.projectId || ''} onChange={(e) => setMembership(s => ({ ...(s as any), projectId: e.target.value }))} fullWidth />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMembershipOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitMembership}>Apply</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
