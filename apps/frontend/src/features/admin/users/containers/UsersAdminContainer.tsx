"use client";
import React from 'react';
import { Box } from '@mui/material';
import UsersTabsToolbar from '../components/UsersTabsToolbar';
import UsersTable from '../components/UsersTable';
import UserInviteDialog from '../components/UserInviteDialog';
import UserEditDialog from '../components/UserEditDialog';
import MembershipDialog from '../components/MembershipDialog';
import { useAdminUsers } from '../hooks/useAdminUsers';

export default function UsersAdminContainer() {
  const { state, actions, invite, edit, membership, deactivate } = useAdminUsers();

  const tabs = React.useMemo(() => {
    const base = [
      { label: 'All', value: 'all' },
      { label: 'Unassigned', value: 'unassigned' },
    ];
    const wsTabs = (state.workspaces || []).map((w: any) => ({ label: w.name, value: w.id }));
    return [...base, ...wsTabs];
  }, [state.workspaces]);

  return (
    <Box>
      <UsersTabsToolbar
        q={state.filters.q || ''}
        onQChange={actions.handleSearch}
        onInviteClick={invite.openInvite}
        tabs={tabs}
        value={state.filters.tab || 'all'}
        onChange={actions.handleTab}
      />

      <UsersTable
        items={state.items as any}
        sortBy={state.filters.sortBy}
        sortDir={state.filters.sortDir}
        onSort={actions.handleSort}
        onEdit={(u) => edit.openEdit(u as any)}
        onDeactivate={(u) => deactivate(u as any)}
        onAddWs={(u) => membership.openMembership(u as any, 'add-ws')}
        onRemoveWs={(u) => membership.openMembership(u as any, 'remove-ws')}
        onAddPrj={(u) => membership.openMembership(u as any, 'add-prj')}
      />

      <UserInviteDialog
        open={invite.open}
        email={invite.data.email}
        name={invite.data.name}
        onChange={invite.setData}
        onClose={invite.closeInvite}
        onSubmit={invite.submitInvite}
      />

      <UserEditDialog
        open={edit.open}
        name={edit.data?.name || ''}
        email={edit.data?.email || ''}
        status={(edit.data?.status as any) ?? 1}
        onChange={(d) => edit.setData((s: any) => ({ ...(s || {}), ...d }))}
        onClose={edit.closeEdit}
        onSubmit={edit.submitEdit}
      />

      {membership.data && (
        <MembershipDialog
          open={membership.open}
          mode={membership.data.mode}
          workspaces={(state.workspaces || []) as any}
          workspaceId={membership.data.workspaceId}
          projectId={membership.data.projectId}
          role={membership.data.role}
          onChange={(d) => membership.setData((s: any) => ({ ...(s || {}), ...d }))}
          onClose={membership.closeMembership}
          onSubmit={membership.submitMembership}
        />
      )}
    </Box>
  );
}
