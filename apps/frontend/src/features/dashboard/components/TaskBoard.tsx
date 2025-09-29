"use client";

import React from 'react';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import type { Task } from '@/shared/types/task';

export type BoardProps = {
  tasks: Task[];
};

const STATUS_ORDER = ['todo', 'in_progress', 'done'];
const STATUS_LABEL: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

function normalizeStatus(status?: string | null) {
  const s = (status || 'todo').toLowerCase().replace(/\s+/g, '_');
  if (STATUS_ORDER.includes(s)) return s;
  return status || 'Other';
}

export default function TaskBoard({ tasks }: BoardProps) {
  const grouped = React.useMemo(() => {
    const by: Record<string, Task[]> = {};
    for (const t of tasks) {
      const key = normalizeStatus(t.status);
      if (!by[key]) by[key] = [];
      by[key].push(t);
    }
    // Ensure default columns exist
    for (const k of STATUS_ORDER) if (!by[k]) by[k] = [];
    return by;
  }, [tasks]);

  const columns = React.useMemo(() => {
    const known = STATUS_ORDER.map((k) => ({ key: k, label: STATUS_LABEL[k] }));
    const others = Object.keys(grouped)
      .filter((k) => !STATUS_ORDER.includes(k))
      .map((k) => ({ key: k, label: k }));
    return [...known, ...others];
  }, [grouped]);

  return (
    <Grid container spacing={2}>
      {columns.map(({ key, label }) => (
        <Grid item xs={12} md={4} key={key}>
          <Box sx={{ bgcolor: 'grey.50', p: 1, borderRadius: 1, minHeight: 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">{label}</Typography>
              <Chip size="small" label={grouped[key]?.length || 0} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {(grouped[key] || []).map((t) => (
                <Card key={t.id} variant="outlined">
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      {t.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {t.assigneeId && (
                        <Chip size="small" label={`Assignee: ${t.assigneeId}`} />
                      )}
                      {'projectName' in t && (t as any).projectName && (
                        <Chip size="small" color="info" label={(t as any).projectName} />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
