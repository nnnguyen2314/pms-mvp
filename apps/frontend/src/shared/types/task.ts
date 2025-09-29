export type Task = {
  id: string;
  title: string;
  status: string;
  assigneeId?: string | null;
  updatedAt?: string | number | null;
  projectId?: string | null;
  projectName?: string | null;
};
