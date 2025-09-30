"use client";
import React from 'react';
import { Chip, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { ListedUser } from '../hooks/useAdminUsers';

function statusLabel(s: number | null | undefined) {
  if (s === 0) return 'Inactive';
  if (s === 1) return 'Active';
  if (s === 2) return 'Disabled';
  if (s === 3) return 'Reactivated';
  return '—';
}

export type UsersTableProps = {
  items: ListedUser[];
  sortBy?: 'name' | 'email' | 'created_at' | 'updated_at' | 'last_login' | 'project_name' | 'status';
  sortDir?: 'asc' | 'desc';
  onSort: (col: NonNullable<UsersTableProps['sortBy']>) => void;
  onEdit: (u: ListedUser) => void;
  onDeactivate: (u: ListedUser) => void;
  onAddWs: (u: ListedUser) => void;
  onRemoveWs: (u: ListedUser) => void;
  onAddPrj: (u: ListedUser) => void;
};

export default function UsersTable(props: UsersTableProps) {
  const { items, onSort, onEdit, onDeactivate, onAddWs, onRemoveWs, onAddPrj } = props;
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>Name</TableCell>
          <TableCell onClick={() => onSort('email')} style={{ cursor: 'pointer' }}>Email</TableCell>
          <TableCell onClick={() => onSort('status')} style={{ cursor: 'pointer' }}>Status</TableCell>
          <TableCell>Workspaces</TableCell>
          <TableCell onClick={() => onSort('project_name')} style={{ cursor: 'pointer' }}>Projects</TableCell>
          <TableCell onClick={() => onSort('last_login')} style={{ cursor: 'pointer' }}>Last login</TableCell>
          <TableCell onClick={() => onSort('created_at')} style={{ cursor: 'pointer' }}>Created</TableCell>
          <TableCell onClick={() => onSort('updated_at')} style={{ cursor: 'pointer' }}>Updated</TableCell>
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
                <IconButton size="small" onClick={() => onAddWs(u)}><PersonAddAlt1Icon fontSize="small" /></IconButton>
              </Tooltip>
              <Tooltip title="Remove from workspace">
                <IconButton size="small" onClick={() => onRemoveWs(u)}><RemoveCircleOutlineIcon fontSize="small" /></IconButton>
              </Tooltip>
              <Tooltip title="Add to project">
                <IconButton size="small" onClick={() => onAddPrj(u)}><PlaylistAddIcon fontSize="small" /></IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
