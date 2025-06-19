import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/Dashboardlayout';
import Dashboard from './Pages/Dashboard';
import Generate from './Pages/Generate';
import Script from './Pages/Script';
import Title from './Pages/Title';
import Thumbnail from './Pages/Thumbnails';
import Settings from './Pages/Settings';
import Seo from './Pages/Seo';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import GoogleAuthRedirect from './api/GoogleAuthRedirect';
import NotFound from './components/NotFound';
import ProtectedRoute from './api/ProtectedRoute';
import useAuthStore from './store/authStore';

const App = () => {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);
 
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/google-auth" element={<GoogleAuthRedirect />} />

      {/* Layout + Protected routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route
          path="generate"
          element={
            <ProtectedRoute>
              <Generate />
            </ProtectedRoute>
          }
        />
        <Route
          path="scripts"
          element={
            <ProtectedRoute>
              <Script />
            </ProtectedRoute>
          }
        />
        <Route
          path="titles"
          element={
            <ProtectedRoute>
              <Title />
            </ProtectedRoute>
          }
        />
        <Route
          path="thumbnails"
          element={
            <ProtectedRoute>
              <Thumbnail />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="seo"
          element={
            <ProtectedRoute>
              <Seo />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
