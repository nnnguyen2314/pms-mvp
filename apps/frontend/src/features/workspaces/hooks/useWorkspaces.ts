"use client";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/shared/store';
import { selectWorkspaces, selectWorkspaceFilters, selectWorkspacesLoading } from '../store/workspaces.slice';
import { Workspace, WorkspaceStatus } from '../types';
import { addWorkspaceMember, createWorkspace, deleteWorkspace, fetchWorkspaces, inviteWorkspaceMemberByEmail, updateWorkspace } from '../store/workspaces.actions';

export type UseWorkspacesReturn = {
  items: Workspace[];
  filters: ReturnType<typeof selectWorkspaceFilters>;
  loading: boolean;
  // state for dialogs/forms
  editing: Workspace | null;
  setEditing: (w: Workspace | null) => void;
  form: { name: string; description?: string; status?: WorkspaceStatus | null };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description?: string; status?: WorkspaceStatus | null }>>;
  invite: { id?: string; email: string; role: 'ADMIN'|'MEMBER'|'GUEST' };
  setInvite: React.Dispatch<React.SetStateAction<{ id?: string; email: string; role: 'ADMIN'|'MEMBER'|'GUEST' }>>;
  addMemberState: { id?: string; userId: string; role: 'ADMIN'|'MEMBER'|'GUEST' };
  setAddMemberState: React.Dispatch<React.SetStateAction<{ id?: string; userId: string; role: 'ADMIN'|'MEMBER'|'GUEST' }>>;
  // actions
  reload: () => void;
  handleSort: (col: 'name'|'status'|'created_at'|'updated_at') => void;
  submitForm: () => Promise<void>;
  onCreate: () => void;
  onEdit: (ws: Workspace) => void;
  onDelete: (ws: Workspace) => Promise<void>;
  onInvite: (ws: Workspace) => void;
  submitInvite: () => Promise<void>;
  onAddMember: (ws: Workspace) => void;
  submitAddMember: () => Promise<void>;
};

export default function useWorkspaces(): UseWorkspacesReturn {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectWorkspaces);
  const filters = useSelector(selectWorkspaceFilters);
  const loading = useSelector(selectWorkspacesLoading);

  const [editing, setEditing] = React.useState<Workspace | null>(null);
  const [form, setForm] = React.useState<{ name: string; description?: string; status?: WorkspaceStatus | null }>({ name: '' });
  const [invite, setInvite] = React.useState<{ id?: string; email: string; role: 'ADMIN'|'MEMBER'|'GUEST' }>({ email: '', role: 'MEMBER' });
  const [addMemberState, setAddMemberState] = React.useState<{ id?: string; userId: string; role: 'ADMIN'|'MEMBER'|'GUEST' }>({ userId: '', role: 'MEMBER' });

  React.useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch, filters.status, filters.sortBy, filters.sortDir]);

  const reload = React.useCallback(() => { dispatch(fetchWorkspaces()); }, [dispatch]);

  const handleSort = (col: 'name'|'status'|'created_at'|'updated_at') => {
    const dir = (filters.sortBy === col && filters.sortDir === 'asc') ? 'desc' : 'asc';
    dispatch({ type: 'workspaces/setFilters', payload: { sortBy: col, sortDir: dir } });
  };

  const onCreate = () => { setEditing(null); setForm({ name: '', description: '', status: 1 }); };
  const onEdit = (ws: Workspace) => { setEditing(ws); setForm({ name: ws.name, description: ws.description || '', status: (ws.status ?? null) as any }); };

  const submitForm = async () => {
    if (!form.name?.trim()) return;
    if (editing) {
      await dispatch(updateWorkspace({ id: editing.id, changes: { name: form.name, description: form.description, status: form.status ?? null } }));
    } else {
      await dispatch(createWorkspace({ name: form.name, description: form.description, status: form.status ?? 1 }));
    }
  };

  const onDelete = async (ws: Workspace) => {
    if (typeof window !== 'undefined' && !window.confirm?.(`Delete workspace "${ws.name}"? This cannot be undone.`)) return;
    await dispatch(deleteWorkspace({ id: ws.id }));
  };

  const onInvite = (ws: Workspace) => { setInvite({ id: ws.id, email: '', role: 'MEMBER' }); };
  const submitInvite = async () => {
    if (!invite.id || !invite.email) return;
    await dispatch(inviteWorkspaceMemberByEmail({ id: invite.id, email: invite.email, role: invite.role }));
  };

  const onAddMember = (ws: Workspace) => { setAddMemberState({ id: ws.id, userId: '', role: 'MEMBER' }); };
  const submitAddMember = async () => {
    if (!addMemberState.id || !addMemberState.userId) return;
    await dispatch(addWorkspaceMember({ id: addMemberState.id, userId: addMemberState.userId, role: addMemberState.role }));
  };

  return {
    items, filters, loading,
    editing, setEditing,
    form, setForm,
    invite, setInvite,
    addMemberState, setAddMemberState,
    reload, handleSort, submitForm, onCreate, onEdit, onDelete, onInvite, submitInvite, onAddMember, submitAddMember,
  };
}
