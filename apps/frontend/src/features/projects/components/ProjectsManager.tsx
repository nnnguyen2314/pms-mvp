"use client";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/shared/store';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { createProject, deleteProject, fetchProjects, updateProject } from '../store/projects.actions';
import { selectProjects, selectProjectFilters } from '../store/projects.slice';
import { Project, ProjectStatus } from '../types';
import { selectWorkspaces } from '@/features/workspaces/store/workspaces.slice';

function statusLabel(s: ProjectStatus | null | undefined) {
  if (s === 0) return 'New';
  if (s === 1) return 'In Progress';
  if (s === 2) return 'Closed';
  return '—';
}

export default function ProjectsManager() {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const filters = useSelector(selectProjectFilters);
  const workspaces = useSelector(selectWorkspaces);

  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [form, setForm] = React.useState<{ workspaceId?: string; name: string; description?: string; status?: ProjectStatus | null }>({ name: '' });

  React.useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, filters.workspaceId, filters.status, filters.sortBy, filters.sortDir]);

  const onCreate = () => { setEditing(null); setForm({ workspaceId: (filters.workspaceId && filters.workspaceId !== 'all') ? String(filters.workspaceId) : workspaces[0]?.id, name: '', description: '', status: 0 }); setOpenForm(true); };
  const onEdit = (p: Project) => { setEditing(p); setForm({ workspaceId: p.workspaceId, name: p.name, description: p.description || '', status: (p.status ?? null) as any }); setOpenForm(true); };
  const onSubmit = async () => {
    if (!form.name?.trim() || !form.workspaceId) return;
    if (editing) {
      await dispatch(updateProject({ id: editing.id, changes: { name: form.name, description: form.description, status: form.status ?? null } }));
    } else {
      await dispatch(createProject({ workspaceId: form.workspaceId, name: form.name, description: form.description, status: form.status ?? 0 }));
    }
    setOpenForm(false);
  };

  const onDelete = async (p: Project) => {
    if (confirm(`Delete project "${p.name}"? This cannot be undone.`)) {
      await dispatch(deleteProject({ id: p.id }));
    }
  };

  const handleSort = (col: 'name'|'status'|'created_at'|'updated_at') => {
    const dir = (filters.sortBy === col && filters.sortDir === 'asc') ? 'desc' : 'asc';
    dispatch({ type: 'projects/setFilters', payload: { sortBy: col, sortDir: dir } });
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Project Management</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Workspace</Typography>
            <Select size="small" value={(filters.workspaceId ?? 'all') as any} onChange={(e) => {
              const ws = e.target.value as string;
              dispatch({ type: 'projects/setFilters', payload: { workspaceId: ws as any } });
            }} style={{ minWidth: 180 }}>
              <MenuItem value={'all'}>All</MenuItem>
              {workspaces.map((ws: any) => (<MenuItem key={ws.id} value={ws.id}>{ws.name}</MenuItem>))}
            </Select>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Status</Typography>
            <Select size="small" value={(filters.status ?? '').toString()} onChange={(e) => {
              const v = e.target.value as string;
              const parsed = v === '' ? undefined : (v === 'null' ? null : Number(v));
              dispatch({ type: 'projects/setFilters', payload: { status: parsed } });
            }} style={{ minWidth: 140 }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value={'0'}>New</MenuItem>
              <MenuItem value={'1'}>In Progress</MenuItem>
              <MenuItem value={'2'}>Closed</MenuItem>
              <MenuItem value={'null'}>No status</MenuItem>
            </Select>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>New Project</Button>
        </Stack>
      </Stack>

      {/* Simple flat table view (optionally grouped by workspace by sorting) */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name</TableCell>
            <TableCell>Workspace</TableCell>
            <TableCell onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status</TableCell>
            <TableCell onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>Created</TableCell>
            <TableCell onClick={() => handleSort('updated_at')} style={{ cursor: 'pointer' }}>Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((p: any) => {
            const ws = workspaces.find((w: any) => w.id === p.workspaceId);
            return (
              <TableRow key={p.id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{ws?.name || p.workspaceId}</TableCell>
                <TableCell><Chip label={statusLabel(p.status ?? null)} size="small" /></TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(p.updatedAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit"><IconButton size="small" onClick={() => onEdit(p)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => onDelete(p)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Select value={form.workspaceId || ''} onChange={(e) => setForm(s => ({ ...s, workspaceId: e.target.value as string }))} displayEmpty>
              <MenuItem value="" disabled>Select workspace</MenuItem>
              {workspaces.map((ws: any) => (<MenuItem key={ws.id} value={ws.id}>{ws.name}</MenuItem>))}
            </Select>
            <TextField label="Name" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} fullWidth />
            <TextField label="Description" value={form.description || ''} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} fullWidth multiline minRows={3} />
            <Select value={(form.status ?? '').toString()} onChange={(e) => {
              const v = e.target.value as string;
              setForm(s => ({ ...s, status: v === '' ? null : Number(v) as any }));
            }} displayEmpty>
              <MenuItem value="">No status</MenuItem>
              <MenuItem value={'0'}>New</MenuItem>
              <MenuItem value={'1'}>In Progress</MenuItem>
              <MenuItem value={'2'}>Closed</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={onSubmit}>{editing ? 'Save' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
