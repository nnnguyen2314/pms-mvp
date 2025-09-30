export type ProjectStatus = 0 | 1 | 2; // 0: new, 1: in progress, 2: closed

export type Project = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: ProjectStatus | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFilters = {
  workspaceId?: string | 'all';
  status?: ProjectStatus | null;
  sortBy?: 'name' | 'status' | 'created_at' | 'updated_at';
  sortDir?: 'asc' | 'desc';
};
