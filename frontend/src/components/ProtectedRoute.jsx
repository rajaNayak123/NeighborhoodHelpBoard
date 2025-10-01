// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a loading spinner or message while checking auth status
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!user) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If logged in, render the component
  return children;
};

export default ProtectedRoute;