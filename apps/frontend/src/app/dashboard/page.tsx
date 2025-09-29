import ProtectedRoute from '@/shared/components/ProtectedRoute';
import DashboardClient from '@/features/dashboard/DashboardClient';

const DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardClient defaultWorkspaceId={DEFAULT_WORKSPACE_ID} />
    </ProtectedRoute>
  );
};

export default Dashboard;
