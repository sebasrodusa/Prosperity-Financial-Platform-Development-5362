import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Navigate } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiFileText, FiActivity, FiUserPlus, FiUserCheck } = FiIcons;

const AdminDashboard = () => {
  const { user, hasPermission } = useAuth();
  const { users, clients, reports } = useData();
  const [activeSection, setActiveSection] = useState('overview');

  if (!hasPermission('VIEW_ADMIN_DASHBOARD')) {
    return <Navigate to="/dashboard" replace />;
  }

  const totalUsers = users.length;
  const totalClients = clients.length;
  const totalReports = reports.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.role === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage users, monitor activity, and oversee platform operations
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="prosperity-card p-0 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveSection('overview')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeSection === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeSection === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
              {pendingUsers > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  {pendingUsers}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSection('activity')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeSection === 'activity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activity Log
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeSection === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="admin-stats">
                <div className="stat-card">
                  <div className="stat-number">{totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{activeUsers}</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{pendingUsers}</div>
                  <div className="stat-label">Pending Approvals</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{totalClients}</div>
                  <div className="stat-label">Total Clients</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{totalReports}</div>
                  <div className="stat-label">Reports Generated</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="prosperity-card mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <button
                    onClick={() => setActiveSection('activity')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => {
                    const reportUser = users.find(u => u.id === report.userId);
                    const client = clients.find(c => c.id === report.clientId);
                    return (
                      <div key={report.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiFileText} className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {reportUser?.name} generated a report for {client?.personalInfo?.firstName} {client?.personalInfo?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(report.generatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="prosperity-card mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveSection('users')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center"
                  >
                    <SafeIcon icon={FiUserCheck} className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-medium text-gray-900">Approve Users</h3>
                    <p className="text-sm text-gray-500 mt-1">Review and approve pending users</p>
                  </button>
                  
                  <button
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center"
                  >
                    <SafeIcon icon={FiUserPlus} className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-medium text-gray-900">Add New User</h3>
                    <p className="text-sm text-gray-500 mt-1">Manually create a new user account</p>
                  </button>
                  
                  <button
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center"
                  >
                    <SafeIcon icon={FiActivity} className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-medium text-gray-900">System Status</h3>
                    <p className="text-sm text-gray-500 mt-1">Check system health and performance</p>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeSection === 'users' && <UserManagement />}

          {activeSection === 'activity' && (
            <div className="text-center py-12">
              <SafeIcon icon={FiActivity} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Log</h3>
              <p className="text-gray-600">The activity log feature is coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;