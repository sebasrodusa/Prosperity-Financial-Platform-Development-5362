import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const ROLES = {
  ADMIN: 'admin',
  ADVISOR: 'advisor',
  CLIENT: 'client',
  PENDING: 'pending'
};

export const PERMISSIONS = {
  VIEW_CLIENTS: ['admin', 'advisor'],
  MANAGE_CLIENTS: ['admin', 'advisor'],
  VIEW_REPORTS: ['admin', 'advisor'],
  GENERATE_REPORTS: ['admin', 'advisor'],
  MANAGE_USERS: ['admin'],
  ACCESS_TOOLS: ['admin', 'advisor'],
  VIEW_ADMIN_DASHBOARD: ['admin'],
  APPROVE_USERS: ['admin']
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
  const [authError, setAuthError] = useState(null);

  // Demo users for testing
  const demoUsers = {
    'sebasrodus+admin@gmail.com': {
      id: 'demo-admin-id',
      email: 'sebasrodus+admin@gmail.com',
      password: 'demo123',
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    'advisor@prosperity.com': {
      id: 'demo-advisor-id',
      email: 'advisor@prosperity.com',
      password: 'demo123',
      name: 'Financial Advisor',
      role: 'advisor',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
    },
    'client@prosperity.com': {
      id: 'demo-client-id',
      email: 'client@prosperity.com',
      password: 'demo123',
      name: 'Demo Client',
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c5cc?w=150&h=150&fit=crop&crop=face'
    }
  };

  // Initialize user from localStorage or Supabase session
  useEffect(() => {
    const initUser = async () => {
      setLoading(true);
      
      // Check for demo user in localStorage
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        try {
          const userData = JSON.parse(demoUser);
          setUser({
            ...userData,
            permissions: PERMISSIONS
          });
          setLoading(false);
          return;
        } catch (e) {
          localStorage.removeItem('demoUser');
        }
      }

      // Check for existing Supabase session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      }
      
      setLoading(false);
    };

    initUser();

    // Set up auth state change listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('demoUser');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile data from Supabase
  const fetchUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles_ak73hs4r1t')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        // Log activity
        await supabase
          .from('user_activity_logs_ak73hs4r1t')
          .insert({
            user_id: userId,
            action: 'login',
            details: { timestamp: new Date().toISOString() }
          });

        // Get auth user data
        const { data: { user: authUser } } = await supabase.auth.getUser();

        // Combine auth and profile data
        setUser({
          id: userId,
          email: authUser.email,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || authUser.email,
          role: profile.role,
          avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.first_name || '')}+${encodeURIComponent(profile.last_name || '')}&background=1e40af&color=fff`,
          permissions: PERMISSIONS
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    return PERMISSIONS[permission]?.includes(user.role) || false;
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      
      // Check if it's a demo user
      const demoUser = demoUsers[email];
      if (demoUser && demoUser.password === password) {
        const userData = {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          avatar: demoUser.avatar,
          permissions: PERMISSIONS
        };
        
        setUser(userData);
        localStorage.setItem('demoUser', JSON.stringify(userData));
        
        return { success: true, user: userData };
      }

      // Try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      setAuthError(null);

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Update profile with first and last name
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles_ak73hs4r1t')
          .update({
            first_name: firstName,
            last_name: lastName
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          // Continue anyway, as the user was created
        }
      }

      return {
        success: true,
        message: "Account created successfully! Please wait for admin approval before logging in."
      };
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Check if it's a demo user
      if (localStorage.getItem('demoUser')) {
        localStorage.removeItem('demoUser');
        setUser(null);
        return;
      }

      if (user) {
        // Log activity before logging out
        await supabase
          .from('user_activity_logs_ak73hs4r1t')
          .insert({
            user_id: user.id,
            action: 'logout',
            details: { timestamp: new Date().toISOString() }
          });
      }

      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const approveUser = async (userId, role) => {
    try {
      if (!hasPermission('APPROVE_USERS')) {
        throw new Error('You do not have permission to approve users');
      }

      const { data, error } = await supabase.rpc('approve_user', {
        user_id: userId,
        new_role: role
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getAllUsers = async () => {
    try {
      if (!hasPermission('MANAGE_USERS')) {
        throw new Error('You do not have permission to view all users');
      }

      const { data, error } = await supabase
        .from('user_profiles_ak73hs4r1t')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, users: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getPendingUsers = async () => {
    try {
      if (!hasPermission('APPROVE_USERS')) {
        throw new Error('You do not have permission to view pending users');
      }

      const { data, error } = await supabase
        .from('pending_users_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, users: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_ak73hs4r1t')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh user data
      await fetchUserProfile(user.id);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    hasPermission,
    authError,
    approveUser,
    getAllUsers,
    getPendingUsers,
    updateUserProfile,
    ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};