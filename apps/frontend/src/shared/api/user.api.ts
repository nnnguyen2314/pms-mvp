import api from './axiosInstance';

export const fetchUserData = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserData = async (userId: string, data: any) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};

// Admin APIs
export const listUsers = async (params: { workspaceId?: string; noWorkspace?: boolean; projectId?: string; sortBy?: string; sortDir?: 'asc'|'desc'; q?: string }) => {
  const response = await api.get(`/users`, { params });
  return response.data;
};

export const inviteUser = async (payload: { email: string; name?: string }) => {
  const response = await api.post(`/users/invite`, payload);
  return response.data;
};

export const deactivateUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const addUserToWorkspace = async (payload: { userId: string; workspaceId: string; workspaceRole?: 'ADMIN'|'MEMBER'|'GUEST' }) => {
  const response = await api.post(`/users/memberships/workspace`, payload);
  return response.data;
};

export const removeUserFromWorkspace = async (payload: { userId: string; workspaceId: string }) => {
  const response = await api.delete(`/users/memberships/workspace`, { data: payload });
  return response.data;
};

export const addUserToProject = async (payload: { userId: string; projectId: string; projectRole?: 'MEMBER'|'GUEST' }) => {
  const response = await api.post(`/users/memberships/project`, payload);
  return response.data;
};

export const removeUserFromProject = async (payload: { userId: string; projectId: string }) => {
  const response = await api.delete(`/users/memberships/project`, { data: payload });
  return response.data;
};
