'use client';

import React from 'react';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import { Typography } from '@mui/material';

export default function WorkspacesPage() {
  return (
    <ProtectedRoute>
      <Typography variant="h5">Workspace Management</Typography>
    </ProtectedRoute>
  );
}
