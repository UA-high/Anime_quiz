import { createBrowserRouter, Navigate } from 'react-router-dom';
import Landing from './features/Landing/pages/Landing';
import PaperPopDashboard from './features/Landing/pages/PaperPopDashboard';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import InterviewPage from './features/interview/pages/InterviewPage';
import AdminUploadPage from './features/interview/pages/AdminUploadPage';
import RoomQuizPage from './features/rooms/pages/RoomQuizPage';
import Loader from './features/auth/components/Loader';
import { useAuth } from './features/auth/hooks/useAuth';

// Protected Route Component for authenticated users
function ProtectedRoute({ children }) {
  const { user, isInitialized, loading } = useAuth();

  if (!isInitialized || loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Protected Route Component for Admin users
function AdminRoute({ children }) {
  const { user, isInitialized, loading } = useAuth();

  if (!isInitialized || loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Public Route (redirect to dashboard if already logged in)
function PublicOnlyRoute({ children }) {
  const { user, isInitialized, loading } = useAuth();

  if (!isInitialized || loading) {
    return <Loader />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <PaperPopDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/interview',
    element: (
      <ProtectedRoute>
        <InterviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/quiz',
    element: (
      <ProtectedRoute>
        <InterviewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/rooms',
    element: (
      <ProtectedRoute>
        <RoomQuizPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/upload',
    element: (
      <AdminRoute>
        <AdminUploadPage />
      </AdminRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
