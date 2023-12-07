import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'src/context/AuthProvider';
import DashboardLayout from 'src/layouts/dashboard';
import { Suspense } from 'react';

export default function RequireAuth({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  return !isAuthenticated ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : allowedRoles.includes(user.role) ? (
    <DashboardLayout>
      <Suspense>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  ) : (
    <Navigate to="/401" state={{ from: location }} replace />
  );
}
