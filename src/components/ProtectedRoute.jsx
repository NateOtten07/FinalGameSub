import { Navigate, useLocation } from 'react-router-dom';
import { loadSettings } from '../logic/settings';

export function ProtectedRoute({ children }) {
  const hasSettings = loadSettings();
  const location = useLocation();
  
  if (!hasSettings) {
    // Store the attempted route in state so we can redirect back after login
    return <Navigate to="/lobby" state={{ from: location.pathname }} replace />;
  }
  return children;
}