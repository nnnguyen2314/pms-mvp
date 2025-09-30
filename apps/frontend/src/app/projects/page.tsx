'use client';

import React from 'react';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import { Typography } from '@mui/material';

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <Typography variant="h5">Project Management</Typography>
    </ProtectedRoute>
  );
}
