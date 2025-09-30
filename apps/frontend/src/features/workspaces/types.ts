export type WorkspaceStatus = 0 | 1 | 2; // 0: inactive, 1: active, 2: archived

export type Workspace = {
  id: string;
  name: string;
  description: string | null;
  status: WorkspaceStatus | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';

export type WorkspaceMember = {
  userId: string;
  role: WorkspaceMemberRole;
  email?: string;
  name?: string;
};

export type WorkspaceFilters = {
  status?: WorkspaceStatus | null;
  sortBy?: 'name' | 'status' | 'created_at' | 'updated_at';
  sortDir?: 'asc' | 'desc';
};
