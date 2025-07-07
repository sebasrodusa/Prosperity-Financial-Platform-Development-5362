import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // Reset data when logged out
      setClients([]);
      setUsers([]);
      setReports([]);
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients_ak73hs4r1t')
        .select('*');
        
      if (clientsError) throw clientsError;

      // Transform from database format to app format
      const transformedClients = clientsData.map(client => ({
        id: client.id,
        userId: client.user_id,
        personalInfo: client.personal_info,
        financialInfo: client.financial_info,
        goals: client.goals,
        insurance: client.insurance,
        createdAt: client.created_at,
        updatedAt: client.updated_at
      }));
      
      setClients(transformedClients);
      
      // Fetch user profiles
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles_ak73hs4r1t')
        .select('*');
        
      if (usersError) throw usersError;

      // Transform user data
      const transformedUsers = usersData.map(profile => ({
        id: profile.id,
        email: profile.email,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        role: profile.role,
        avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.first_name || '')}+${encodeURIComponent(profile.last_name || '')}&background=1e40af&color=fff`,
        createdAt: profile.created_at,
        lastLogin: profile.updated_at,
        status: profile.role === 'pending' ? 'pending' : 'active',
        clientCount: clientsData.filter(c => c.user_id === profile.id).length,
        reportsGenerated: 0
      }));
      
      setUsers(transformedUsers);
      
      // Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports_ak73hs4r1t')
        .select('*');
        
      if (reportsError) throw reportsError;

      // Transform report data
      const transformedReports = reportsData.map(report => ({
        id: report.id,
        clientId: report.client_id,
        userId: report.user_id,
        title: report.title,
        type: report.type,
        generatedAt: report.generated_at,
        status: report.status
      }));
      
      setReports(transformedReports);
      
      // Update user report counts
      setUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          reportsGenerated: transformedReports.filter(r => r.userId === user.id).length
        }))
      );
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      
      // Load demo data as fallback
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    // Demo client data
    const demoClients = [
      {
        id: '1',
        userId: user?.id || '2',
        personalInfo: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '(555) 123-4567',
          dateOfBirth: '1985-03-15',
          address: '123 Main St, Anytown, ST 12345',
          maritalStatus: 'married',
          dependents: 2
        },
        financialInfo: {
          income: {
            salary: 75000,
            bonus: 5000,
            investment: 2000,
            other: 0
          },
          expenses: {
            housing: 2000,
            transportation: 800,
            food: 600,
            utilities: 300,
            insurance: 400,
            entertainment: 300,
            other: 500
          },
          assets: {
            checking: 5000,
            savings: 25000,
            retirement: 45000,
            investments: 30000,
            realEstate: 250000,
            other: 10000
          },
          liabilities: {
            mortgage: 180000,
            carLoans: 15000,
            creditCards: 8000,
            studentLoans: 25000,
            other: 2000
          }
        },
        goals: [
          {
            id: '1',
            name: 'Emergency Fund',
            target: 30000,
            current: 25000,
            deadline: '2024-12-31'
          },
          {
            id: '2',
            name: 'Retirement',
            target: 500000,
            current: 45000,
            deadline: '2045-12-31'
          }
        ],
        insurance: [
          {
            id: '1',
            type: 'Life Insurance',
            provider: 'ABC Insurance',
            coverage: 300000,
            premium: 150,
            frequency: 'monthly'
          },
          {
            id: '2',
            type: 'Health Insurance',
            provider: 'XYZ Health',
            coverage: 50000,
            premium: 400,
            frequency: 'monthly'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Use current user as first user in demo data
    const demoUsers = [
      {
        id: user?.id || '1',
        email: user?.email || 'sebasrodus+admin@gmail.com',
        name: user?.name || 'Admin User',
        role: user?.role || 'admin',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        createdAt: '2024-01-15T10:00:00.000Z',
        lastLogin: new Date().toISOString(),
        status: 'active',
        clientCount: 1,
        reportsGenerated: 1
      },
      {
        id: '2',
        email: 'advisor@prosperity.com',
        name: 'Financial Advisor',
        role: 'advisor',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        createdAt: '2024-01-10T14:20:00.000Z',
        lastLogin: '2024-01-20T08:15:00.000Z',
        status: 'active',
        clientCount: 1,
        reportsGenerated: 3
      }
    ];

    const demoReports = [
      {
        id: '1',
        clientId: '1',
        userId: user?.id || '1',
        title: 'Financial Analysis Report - John Smith',
        type: 'comprehensive',
        generatedAt: '2024-01-20T10:00:00.000Z',
        status: 'completed'
      }
    ];

    setClients(demoClients);
    setUsers(demoUsers);
    setReports(demoReports);
  };

  const syncWithDatabase = async () => {
    if (!user) return;
    
    try {
      // Sync clients
      for (const client of clients) {
        await supabase.rpc('sync_clients', { client_data: client });
      }
      
      // Sync reports
      for (const report of reports) {
        await supabase.rpc('sync_reports', { report_data: report });
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error syncing with database:', err);
      return { success: false, error: err.message };
    }
  };

  const addClient = async (clientData) => {
    const newClient = {
      id: uuidv4(),
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Update local state
    setClients(prev => [...prev, newClient]);
    
    // Sync with database
    try {
      const { data, error } = await supabase.rpc('sync_clients', { 
        client_data: newClient 
      });
      
      if (error) throw error;
      
      // Update user client count
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === newClient.userId 
            ? { ...u, clientCount: u.clientCount + 1 } 
            : u
        )
      );
      
      return newClient;
    } catch (err) {
      console.error('Error adding client:', err);
      return newClient; // Return anyway to maintain local functionality
    }
  };

  const updateClient = async (clientId, updates) => {
    const updatedClient = {
      ...clients.find(client => client.id === clientId),
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Update local state
    setClients(prev => 
      prev.map(client => 
        client.id === clientId ? updatedClient : client
      )
    );
    
    // Sync with database
    try {
      const { error } = await supabase.rpc('sync_clients', { 
        client_data: updatedClient 
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (err) {
      console.error('Error updating client:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteClient = async (clientId) => {
    // Update local state
    setClients(prev => prev.filter(client => client.id !== clientId));
    
    // Delete from database
    try {
      const { error } = await supabase
        .from('clients_ak73hs4r1t')
        .delete()
        .eq('id', clientId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting client:', err);
      return { success: false, error: err.message };
    }
  };

  const getClientsByUserId = (userId) => {
    return clients.filter(client => client.userId === userId);
  };

  const addReport = async (reportData) => {
    const newReport = {
      id: uuidv4(),
      ...reportData,
      generatedAt: new Date().toISOString(),
      status: 'completed'
    };
    
    // Update local state
    setReports(prev => [...prev, newReport]);
    
    // Sync with database
    try {
      const { error } = await supabase.rpc('sync_reports', { 
        report_data: newReport 
      });
      
      if (error) throw error;
      
      // Update user report count
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === newReport.userId 
            ? { ...u, reportsGenerated: u.reportsGenerated + 1 } 
            : u
        )
      );
      
      return newReport;
    } catch (err) {
      console.error('Error adding report:', err);
      return newReport; // Return anyway to maintain local functionality
    }
  };

  const calculateNetIncome = (income, expenses) => {
    const totalIncome = Object.values(income).reduce((sum, val) => sum + (val || 0), 0);
    const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + (val || 0), 0);
    return totalIncome - totalExpenses;
  };

  const calculateNetWorth = (assets, liabilities) => {
    const totalAssets = Object.values(assets).reduce((sum, val) => sum + (val || 0), 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + (val || 0), 0);
    return totalAssets - totalLiabilities;
  };

  const value = {
    clients,
    users,
    reports,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    getClientsByUserId,
    addReport,
    calculateNetIncome,
    calculateNetWorth,
    syncWithDatabase,
    refreshData: fetchData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};