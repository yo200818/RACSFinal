import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UnauthorizedScreen } from './UnauthorizedScreen';

export function ProtectedRoute({ allowedRoles = [], featureName = 'Protected Module', children }) {
  const { currentRole } = useAuth();

  if (!allowedRoles.includes(currentRole)) {
    return <UnauthorizedScreen allowedRoles={allowedRoles} featureName={featureName} />;
  }

  return children;
}
