"use client";

import React from 'react';
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import DashboardHeader, { WorkspaceOption } from './components/DashboardHeader';
import TaskBoard from './components/TaskBoard';
import TaskTable from './components/TaskTable';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { getAuthState } from '@/features/auth/store/auth.selectors';
import { fetchDashboardTasks } from '@/features/dashboard/store/dashboard.actions';
import { getDashboardTasks, getDashboardLoading, getDashboardWorkspaceId } from '@/features/dashboard/store/dashboard.selectors';
import { setWorkspaceId as setDashboardWorkspaceId } from '@/features/dashboard/store/dashboard.slice';
import type { Task } from '@/shared/types/task';
import { Loading } from '@/shared/types';

const DEFAULT_WORKSPACE: WorkspaceOption = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Default Workspace',
};

type ViewMode = 'board' | 'table';

type Scope = 'all' | 'active' | 'in_progress';

function normalizeStatus(s?: string | null) {
  return (s || '').toLowerCase().replace(/\s+/g, '_') || 'todo';
}

export default function DashboardClient({ defaultWorkspaceId = DEFAULT_WORKSPACE.id }: { defaultWorkspaceId?: string }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(getAuthState);
  const workspaceId = useAppSelector(getDashboardWorkspaceId);
  const tasks = useAppSelector(getDashboardTasks);
  const loading = useAppSelector(getDashboardLoading);
  const [workspaces] = React.useState<WorkspaceOption[]>([DEFAULT_WORKSPACE]);

  const [scope, setScope] = React.useState<Scope>('all');
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [assigneeFilter, setAssigneeFilter] = React.useState<string[]>([]);
  const [projectFilter, setProjectFilter] = React.useState<string[]>([]);
  const [view, setView] = React.useState<ViewMode>('board');

  // Ensure workspace is set
  React.useEffect(() => {
    if (!workspaceId && defaultWorkspaceId) {
      dispatch(setDashboardWorkspaceId(defaultWorkspaceId));
    }
  }, [workspaceId, defaultWorkspaceId, dispatch]);

  // Fetch dashboard tasks on workspace/auth changes
  React.useEffect(() => {
    if (isAuthenticated && (workspaceId || defaultWorkspaceId)) {
      const id = workspaceId || defaultWorkspaceId;
      if (id) dispatch(fetchDashboardTasks(id));
    }
  }, [isAuthenticated, workspaceId, defaultWorkspaceId, dispatch]);

  const uniqueStatuses = React.useMemo<string[]>(() =>
    Array.from(new Set(tasks.map((t: any) => normalizeStatus(t.status)))), [tasks]);
  const assignees = React.useMemo(() =>
    Array.from(new Set(tasks.map((t: any) => t.assigneeId).filter(Boolean))) as string[], [tasks]);
  const projects = React.useMemo(() => {
    const names = tasks.map((t: any) => (t.projectName || t.projectId) as string | null).filter(Boolean) as string[];
    return Array.from(new Set(names));
  }, [tasks]);

  const filteredTasks: Task[] = React.useMemo(() => {
    let list = tasks;

    // Scope
    if (scope === 'active') {
      list = list.filter((t: any) => normalizeStatus(t.status) !== 'done');
    } else if (scope === 'in_progress') {
      list = list.filter((t: any) => normalizeStatus(t.status) === 'in_progress');
    }

    // Status filter
    if (statusFilter.length) {
      const set = new Set(statusFilter);
      list = list.filter((t: any) => set.has(normalizeStatus(t.status)));
    }

    // Assignee filter
    if (assigneeFilter.length) {
      const set = new Set(assigneeFilter);
      list = list.filter((t: any) => (t.assigneeId ? set.has(t.assigneeId) : false));
    }

    // Project filter
    if (projectFilter.length) {
      const set = new Set(projectFilter);
      list = list.filter((t: any) => set.has((t.projectName || t.projectId || '') as string));
    }

    return list;
  }, [tasks, scope, statusFilter, assigneeFilter, projectFilter]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <DashboardHeader
        workspaceId={workspaceId || defaultWorkspaceId}
        workspaces={workspaces}
        onChangeWorkspace={(id) => dispatch(setDashboardWorkspaceId(id))}
      />

      {/* Controls */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
        <ToggleButtonGroup
          size="small"
          value={scope}
          exclusive
          onChange={(_, v) => v && setScope(v)}
          aria-label="project-scope"
        >
          <ToggleButton value="all">All recent</ToggleButton>
          <ToggleButton value="active">Active</ToggleButton>
          <ToggleButton value="in_progress">In progress</ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

        <Autocomplete<string, true>
          size="small"
          sx={{ minWidth: 200 }}
          multiple
          options={uniqueStatuses}
          value={statusFilter}
          onChange={(_, v) => setStatusFilter(v)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Status" placeholder="Filter" />}
        />

        <Autocomplete<string, true>
          size="small"
          sx={{ minWidth: 220 }}
          multiple
          options={assignees}
          value={assigneeFilter}
          onChange={(_, v) => setAssigneeFilter(v)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Assignee" placeholder="Filter" />}
        />

        <Autocomplete<string, true>
          size="small"
          sx={{ minWidth: 220 }}
          multiple
          options={projects}
          value={projectFilter}
          onChange={(_, v) => setProjectFilter(v)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Project" placeholder="Filter" />}
        />

        <Box sx={{ flexGrow: 1 }} />

        <ToggleButtonGroup
          size="small"
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          aria-label="view-mode"
        >
          <ToggleButton value="board">Board</ToggleButton>
          <ToggleButton value="table">Table</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Content */}
      {loading === Loading.pending ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box>
          {view === 'board' ? (
            <TaskBoard tasks={filteredTasks} />
          ) : (
            <TaskTable tasks={filteredTasks} />
          )}
        </Box>
      )}
    </Box>
  );
}
