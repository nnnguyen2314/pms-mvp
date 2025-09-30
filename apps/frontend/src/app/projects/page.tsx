'use client';

import React from 'react';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import ProjectsManager from '@/features/projects/components/ProjectsManager';

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ProjectsManager />
    </ProtectedRoute>
  );
}
