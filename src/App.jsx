import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import ManagerDashboard from './pages/ManagerDashboard';
import ResidentDashboard from './pages/ResidentDashboard';
import DuesPage from './pages/DuesPage';
import PaymentsPage from './pages/PaymentsPage';
import MaintenancePage from './pages/MaintenancePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import NotFoundPage from './pages/NotFoundPage';

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Navigate to={user.role === 'manager' ? '/dashboard/manager' : '/dashboard/resident'} replace />
  );
}

function ProtectedLayout({ children, requireRole }) {
  return (
    <ProtectedRoute requireRole={requireRole}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />

        <Route
          path="/dashboard/manager"
          element={
            <ProtectedLayout requireRole="manager">
              <ManagerDashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/dashboard/resident"
          element={
            <ProtectedLayout requireRole="resident">
              <ResidentDashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/dues"
          element={
            <ProtectedLayout>
              <DuesPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedLayout>
              <PaymentsPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedLayout>
              <MaintenancePage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedLayout>
              <AnnouncementsPage />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
