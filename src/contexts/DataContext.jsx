import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Load demo data
    const demoClients = [
      {
        id: '1',
        userId: '2',
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

    const demoUsers = [
      {
        id: '1',
        email: 'admin@prosperity.com',
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        createdAt: '2024-01-15T10:00:00.000Z',
        lastLogin: '2024-01-20T09:30:00.000Z',
        status: 'active',
        clientCount: 0,
        reportsGenerated: 0
      },
      {
        id: '2',
        email: 'advisor@prosperity.com',
        name: 'Financial Advisor',
        role: 'financial_professional',
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
        userId: '2',
        title: 'Financial Analysis Report - John Smith',
        type: 'comprehensive',
        generatedAt: '2024-01-20T10:00:00.000Z',
        status: 'completed'
      }
    ];

    setClients(demoClients);
    setUsers(demoUsers);
    setReports(demoReports);
  }, []);

  const addClient = (clientData) => {
    const newClient = {
      id: uuidv4(),
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (clientId, updates) => {
    setClients(prev => 
      prev.map(client => 
        client.id === clientId 
          ? { ...client, ...updates, updatedAt: new Date().toISOString() }
          : client
      )
    );
  };

  const deleteClient = (clientId) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  };

  const getClientsByUserId = (userId) => {
    return clients.filter(client => client.userId === userId);
  };

  const addReport = (reportData) => {
    const newReport = {
      id: uuidv4(),
      ...reportData,
      generatedAt: new Date().toISOString(),
      status: 'completed'
    };
    setReports(prev => [...prev, newReport]);
    return newReport;
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
    addClient,
    updateClient,
    deleteClient,
    getClientsByUserId,
    addReport,
    calculateNetIncome,
    calculateNetWorth
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};