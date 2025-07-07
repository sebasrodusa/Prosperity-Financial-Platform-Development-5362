import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Navigate } from 'react-router-dom';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiFileText, FiActivity, FiEye, FiUserX, FiTrash2, FiKey } = FiIcons;

const AdminDashboard = () => {
  const { user } = useAuth();
  const { users, clients, reports } = useData();
  const [selectedUser, setSelectedUser] = useState(null);

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const totalUsers = users.length;
  const totalClients = clients.length;
  const totalReports = reports.length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleUserAction = (userId, action) => {
    console.log(`${action} user ${userId}`);
    // In a real app, this would make API calls
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage users, monitor activity, and oversee platform operations
        </p>
      </div>

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
          <div className="stat-number">{totalClients}</div>
          <div className="stat-label">Total Clients</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalReports}</div>
          <div className="stat-label">Reports Generated</div>
        </div>
      </div>

      {/* User Management */}
      <div className="prosperity-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
        <div className="responsive-table">
          <table className="table-prosperity w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Clients</th>
                <th>Reports</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="capitalize badge-success">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{user.clientCount}</td>
                  <td>{user.reportsGenerated}</td>
                  <td>{formatDate(user.lastLogin)}</td>
                  <td>
                    <span className={`badge-${user.status === 'active' ? 'success' : 'warning'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="user-actions">
                      <button
                        onClick={() => handleUserAction(user.id, 'view')}
                        className="action-btn view"
                        title="View Details"
                      >
                        <SafeIcon icon={FiEye} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'deactivate')}
                        className="action-btn deactivate"
                        title="Deactivate User"
                      >
                        <SafeIcon icon={FiUserX} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'reset')}
                        className="action-btn reset"
                        title="Reset Password"
                      >
                        <SafeIcon icon={FiKey} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="action-btn delete"
                        title="Delete User"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="prosperity-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
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
                    {formatDate(report.generatedAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;