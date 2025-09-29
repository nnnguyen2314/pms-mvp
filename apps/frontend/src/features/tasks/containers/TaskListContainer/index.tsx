"use client";

import React from 'react';
import { useAppSelector } from '@/shared/hooks';
import { getAuthState } from '@/features/auth/store/auth.selectors';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import TaskList from '@/features/tasks/components/TaskList';

export default function TaskListContainer({ workspaceId }: { workspaceId: string }) {
  const { isAuthenticated } = useAppSelector(getAuthState);
  const { data = [], isLoading } = useTasks(workspaceId, isAuthenticated);

  if (isLoading) return <div>Loading tasks...</div>;
  return <TaskList tasks={data} />;
}
