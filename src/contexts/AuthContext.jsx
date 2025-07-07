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

  // Initialize user from Supabase session
  useEffect(() => {
    const initUser = async () => {
      setLoading(true);
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    initUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
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
        
        if (profileError) throw profileError;
      }
      
      return { 
        success: true, 
        message: "Account created successfully! Please wait for admin approval before logging in." 
      };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
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