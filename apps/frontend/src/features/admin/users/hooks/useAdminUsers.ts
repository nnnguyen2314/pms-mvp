"use client";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/shared/store';
import { fetchWorkspaces } from '@/features/workspaces/store/workspaces.actions';
import { selectWorkspaces } from '@/features/workspaces/store/workspaces.slice';
import { selectAdminUsers, selectAdminUsersFilters, selectAdminUsersLoading, setFilters } from '../store/usersAdmin.slice';
import { addUserToProjectAdmin, addUserToWorkspaceAdmin, deactivateAdminUser, fetchAdminUsers, inviteAdminUser, removeUserFromProjectAdmin, removeUserFromWorkspaceAdmin, updateAdminUser } from '../store/usersAdmin.actions';

export type ListedUser = {
  id: string;
  name: string;
  email: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  last_login?: string | null;
  workspaces?: string[];
  projects?: string[];
};

export type MembershipMode = 'add-ws'|'remove-ws'|'add-prj'|'remove-prj';

export function useAdminUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const workspaces = useSelector(selectWorkspaces);
  const filters = useSelector(selectAdminUsersFilters);
  const items = useSelector(selectAdminUsers) as any as ListedUser[];
  const loading = useSelector(selectAdminUsersLoading);

  // Local dialog states (UI-oriented but managed here to centralize logic interaction)
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [invite, setInvite] = React.useState<{ email: string; name?: string }>({ email: '' });

  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Partial<ListedUser> | null>(null);

  const [membershipOpen, setMembershipOpen] = React.useState(false);
  const [membership, setMembership] = React.useState<{ userId: string; workspaceId?: string; projectId?: string; mode: MembershipMode; role?: 'ADMIN'|'MEMBER'|'GUEST' } | null>(null);

  React.useEffect(() => { dispatch(fetchWorkspaces()); }, [dispatch]);
  React.useEffect(() => { dispatch(fetchAdminUsers()); }, [dispatch, filters.q, filters.sortBy, filters.sortDir, filters.tab]);

  const handleSort = (col: NonNullable<typeof filters.sortBy>) => {
    const dir = (filters.sortBy === col && filters.sortDir === 'asc') ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: col, sortDir: dir }));
  };

  const handleSearch = (q: string) => dispatch(setFilters({ q }));
  const handleTab = (tab: string) => dispatch(setFilters({ tab }));

  const openInvite = () => setInviteOpen(true);
  const closeInvite = () => setInviteOpen(false);
  const submitInvite = async () => {
    if (!invite.email) return;
    await dispatch(inviteAdminUser(invite));
    setInviteOpen(false);
    setInvite({ email: '' });
  };

  const openEdit = (u: ListedUser) => { setEditing({ ...u }); setEditOpen(true); };
  const closeEdit = () => setEditOpen(false);
  const submitEdit = async () => {
    if (!editing?.id) return;
    await dispatch(updateAdminUser({ id: editing.id, changes: { name: editing.name as any, email: editing.email as any, status: editing.status as any } }));
    setEditOpen(false);
    setEditing(null);
  };

  const deactivate = async (u: ListedUser) => {
    if (!confirm(`Deactivate ${u.email}?`)) return;
    await dispatch(deactivateAdminUser({ id: u.id }));
  };

  const openMembership = (u: ListedUser, mode: MembershipMode) => { setMembership({ userId: u.id, mode }); setMembershipOpen(true); };
  const closeMembership = () => setMembershipOpen(false);
  const submitMembership = async () => {
    if (!membership) return;
    const { mode, userId, workspaceId, projectId, role } = membership;
    if (mode === 'add-ws' && userId && workspaceId) await dispatch(addUserToWorkspaceAdmin({ userId, workspaceId, role: role || 'MEMBER' }));
    if (mode === 'remove-ws' && userId && workspaceId) await dispatch(removeUserFromWorkspaceAdmin({ userId, workspaceId }));
    if (mode === 'add-prj' && userId && projectId) await dispatch(addUserToProjectAdmin({ userId, projectId, role: 'MEMBER' }));
    if (mode === 'remove-prj' && userId && projectId) await dispatch(removeUserFromProjectAdmin({ userId, projectId }));
    setMembershipOpen(false);
    setMembership(null);
  };

  return {
    state: { workspaces, filters, items, loading },
    actions: { handleSort, handleSearch, handleTab },
    invite: { open: inviteOpen, data: invite, setData: setInvite, openInvite, closeInvite, submitInvite },
    edit: { open: editOpen, data: editing, setData: setEditing, openEdit, closeEdit, submitEdit },
    membership: { open: membershipOpen, data: membership, setData: setMembership, openMembership, closeMembership, submitMembership },
    deactivate,
  };
}
