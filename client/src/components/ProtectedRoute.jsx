import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;