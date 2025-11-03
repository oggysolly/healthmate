import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AlertManager from './components/AlertManager';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Medication from './pages/Medication';
import Sleep from './pages/Sleep';
import Mood from './pages/Mood';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">⚕️</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

// Component to set up navigation callback
function NavigationSetup() {
  const navigate = useNavigate();
  const { setNavigateCallback } = useAuth();

  useEffect(() => {
    // Set navigate callback after component mounts
    if (setNavigateCallback) {
      setNavigateCallback(navigate);
    }
  }, [navigate, setNavigateCallback]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <NavigationSetup />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/medication"
          element={
            <PrivateRoute>
              <Medication />
            </PrivateRoute>
          }
        />
        <Route
          path="/sleep"
          element={
            <PrivateRoute>
              <Sleep />
            </PrivateRoute>
          }
        />
        <Route
          path="/mood"
          element={
            <PrivateRoute>
              <Mood />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppRoutes />
        <AlertManager />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
