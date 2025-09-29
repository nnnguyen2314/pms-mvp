import api from '@/shared/api/axiosInstance';
import { Task } from '@/shared/types/task';

export async function fetchTasks(workspaceId: string): Promise<Task[]> {
  const { data } = await api.get('/tasks', { params: { workspaceId } });
  return data?.tasks ?? data ?? [];
}
