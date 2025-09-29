"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '@/shared/api/tasks.api';
import { Task } from '@/shared/types/task';

export function useTasks(workspaceId: string, enabled = true) {
  return useQuery<Task[]>({
    queryKey: ['tasks', workspaceId],
    queryFn: () => fetchTasks(workspaceId),
    enabled: enabled && !!workspaceId,
  });
}
