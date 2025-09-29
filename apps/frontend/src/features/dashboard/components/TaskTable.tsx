"use client";

import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Task } from '@/shared/types/task';

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((t) => (
            <TableRow key={t.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>{t.title}</Typography>
              </TableCell>
              <TableCell>{t.status}</TableCell>
              <TableCell>{t.assigneeId || '-'}</TableCell>
              <TableCell>
                {t.updatedAt ? new Date(t.updatedAt as any).toLocaleString() : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
