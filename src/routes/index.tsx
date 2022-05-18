import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type PrivateRouteProp = {
  redirectTo: string
}

type PublicRouteProp = {
  redirectTo: string
}

export function PrivateRoute({ redirectTo }: PrivateRouteProp) {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to={redirectTo} />;
}

export function PublicRoute({ redirectTo }: PublicRouteProp) {
  const { user } = useAuth();

  return !user ? <Outlet /> : <Navigate to={redirectTo} />;
}
