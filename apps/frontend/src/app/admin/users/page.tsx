'use client';

import React from 'react';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import UsersAdminContainer from '@/features/admin/users/containers/UsersAdminContainer';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute>
      <UsersAdminContainer />
    </ProtectedRoute>
  );
}
