import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PermissionGate = ({ permission, children }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return null;
  }

  return children;
};

export default PermissionGate;