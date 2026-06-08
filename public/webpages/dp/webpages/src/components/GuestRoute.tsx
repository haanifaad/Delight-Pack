import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';

interface GuestRouteProps {
  children: React.ReactNode;
}

/** Redirect authenticated users away from login/register pages. */
export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading, isEmailVerified } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" aria-hidden="true" />
      </div>
    );
  }

  if (user && isEmailVerified) {
    return <Navigate to="/" replace />;
  }

  if (user && !isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
}
