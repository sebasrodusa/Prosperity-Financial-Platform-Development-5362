import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
  ADMIN: 'admin',
  ADVISOR: 'advisor',
  CLIENT: 'client'
};

export const PERMISSIONS = {
  VIEW_CLIENTS: ['admin', 'advisor'],
  MANAGE_CLIENTS: ['admin', 'advisor'],
  VIEW_REPORTS: ['admin', 'advisor'],
  GENERATE_REPORTS: ['admin', 'advisor'],
  MANAGE_USERS: ['admin'],
  ACCESS_TOOLS: ['admin', 'advisor'],
  VIEW_ADMIN_DASHBOARD: ['admin']
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('prosperityUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    return PERMISSIONS[permission]?.includes(user.role) || false;
  };

  const login = async (email, password) => {
    try {
      // Demo authentication logic
      const demoUsers = [
        {
          id: '1',
          email: 'admin@prosperity.com',
          name: 'Admin User',
          role: ROLES.ADMIN,
          permissions: Object.keys(PERMISSIONS),
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '2',
          email: 'advisor@prosperity.com',
          name: 'Financial Advisor',
          role: ROLES.ADVISOR,
          permissions: [
            'VIEW_CLIENTS',
            'MANAGE_CLIENTS',
            'VIEW_REPORTS',
            'GENERATE_REPORTS',
            'ACCESS_TOOLS'
          ],
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
        }
      ];

      const foundUser = demoUsers.find(u => u.email === email);
      if (foundUser && password === 'demo123') {
        setUser(foundUser);
        localStorage.setItem('prosperityUser', JSON.stringify(foundUser));
        return { success: true, user: foundUser };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prosperityUser');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    hasPermission,
    ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};