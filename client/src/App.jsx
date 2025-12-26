import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LoginRegister from './pages/LoginRegister';
import VesselsPage from './pages/Vessels';
import PortsPage from './pages/Ports';
import VoyagesPage from './pages/Voyages';
import EventsPage from './pages/Events';
import NotificationsPage from './pages/Notifications';
import LiveTrackingPage from './pages/LiveTracking';
import ProfilePage from './pages/Profile';
import ProfileEditPage from './pages/ProfileEdit';
import AppLayout from './components/AppLayout';
import { authAPI } from './services/api';
import Dashboard from './pages/Dashboard';




// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!authAPI.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children || <Outlet />;
};

// Update document title on route change
const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = 'MVTPS - Maritime Vessel Tracking & Port Safety';
  }, [location.pathname]);

  return null;
};

const App = () => {
  return (
    <Router>
      <PageTitleUpdater />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            authAPI.isAuthenticated() ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <LoginRegister />
              </main>
            )
          }
        />
        <Route
          path="/register"
          element={
            authAPI.isAuthenticated() ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <LoginRegister />
              </main>
            )
          }
        />

        {/* Protected routes */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin/dashboard" element={<Dashboard title="Admin Dashboard" />} />
          <Route path="/operator/dashboard" element={<Dashboard title="Operator Dashboard" />} />
          <Route path="/analyst/dashboard" element={<Dashboard title="Analyst Dashboard" />} />
          <Route path="/vessels" element={<VesselsPage />} />
          <Route path="/ports" element={<PortsPage />} />
          <Route path="/voyages" element={<VoyagesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/live-tracking" element={<LiveTrackingPage />} />

          {/* Profile routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;