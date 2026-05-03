import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh', fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" />;
}