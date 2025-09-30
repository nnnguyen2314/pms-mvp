"use client";
import React from 'react';
import { Chip, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Workspace, WorkspaceStatus } from '../types';

function statusLabel(s: WorkspaceStatus | null | undefined) {
  if (s === 0) return 'Inactive';
  if (s === 1) return 'Active';
  if (s === 2) return 'Archived';
  return '—';
}

export default function WorkspacesTable({
  items,
  onSort,
  onEdit,
  onDelete,
  onInvite,
  onAdd,
}: {
  items: Workspace[];
  onSort: (col: 'name'|'status'|'created_at'|'updated_at') => void;
  onEdit: (ws: Workspace) => void;
  onDelete: (ws: Workspace) => void;
  onInvite: (ws: Workspace) => void;
  onAdd: (ws: Workspace) => void;
}) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>Name</TableCell>
          <TableCell>Description</TableCell>
          <TableCell onClick={() => onSort('status')} style={{ cursor: 'pointer' }}>Status</TableCell>
          <TableCell onClick={() => onSort('created_at')} style={{ cursor: 'pointer' }}>Created</TableCell>
          <TableCell onClick={() => onSort('updated_at')} style={{ cursor: 'pointer' }}>Updated</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((ws) => (
          <TableRow key={ws.id} hover>
            <TableCell>{ws.name}</TableCell>
            <TableCell>{ws.description}</TableCell>
            <TableCell>
              <Chip label={statusLabel(ws.status ?? null)} size="small" />
            </TableCell>
            <TableCell>{new Date(ws.createdAt!).toLocaleString()}</TableCell>
            <TableCell>{new Date(ws.updatedAt!).toLocaleString()}</TableCell>
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
  );
}
