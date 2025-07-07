import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiUserCheck, FiUserX, FiCheck, FiX, FiRefreshCw } = FiIcons;

const UserManagement = () => {
  const { getAllUsers, getPendingUsers, approveUser, ROLES } = useAuth();
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all users
      const allUsersResult = await getAllUsers();
      if (!allUsersResult.success) {
        throw new Error(allUsersResult.error);
      }
      setUsers(allUsersResult.users);
      
      // Fetch pending users
      const pendingUsersResult = await getPendingUsers();
      if (!pendingUsersResult.success) {
        throw new Error(pendingUsersResult.error);
      }
      setPendingUsers(pendingUsersResult.users);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveUser = async (userId, role) => {
    try {
      const result = await approveUser(userId, role);
      if (result.success) {
        setSuccessMessage(`User approved successfully as ${role}`);
        
        // Remove user from pending list
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
        
        // Update user in all users list
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, role: role } 
            : user
        ));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError(result.error || 'Failed to approve user');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'advisor':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        <button 
          onClick={fetchData} 
          className="btn-secondary flex items-center space-x-2"
        >
          <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SafeIcon icon={FiUsers} className="w-4 h-4" />
            <span>All Users</span>
          </button>
          
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SafeIcon icon={FiUserCheck} className="w-4 h-4" />
            <span>Pending Approvals {pendingUsers.length > 0 && `(${pendingUsers.length})`}</span>
          </button>
        </nav>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : activeTab === 'pending' ? (
        <div className="prosperity-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Users</h3>
          
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon icon={FiUserCheck} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending users to approve</p>
            </div>
          ) : (
            <div className="responsive-table">
              <table className="table-prosperity w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="font-medium text-gray-900">{user.email}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveUser(user.id, ROLES.ADVISOR)}
                            className="action-btn view flex items-center space-x-1"
                            title="Approve as Advisor"
                          >
                            <SafeIcon icon={FiCheck} className="w-4 h-4" />
                            <span>Approve as Advisor</span>
                          </button>
                          
                          <button
                            onClick={() => handleApproveUser(user.id, ROLES.CLIENT)}
                            className="action-btn reset flex items-center space-x-1"
                            title="Approve as Client"
                          >
                            <SafeIcon icon={FiCheck} className="w-4 h-4" />
                            <span>Approve as Client</span>
                          </button>
                          
                          <button
                            className="action-btn delete flex items-center space-x-1"
                            title="Reject"
                          >
                            <SafeIcon icon={FiX} className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="prosperity-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Users</h3>
          
          {users.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="responsive-table">
              <table className="table-prosperity w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">
                              {user.first_name?.charAt(0) || ''}{user.last_name?.charAt(0) || ''}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            className="action-btn view"
                            title="View Details"
                          >
                            <SafeIcon icon={FiUsers} className="w-4 h-4" />
                          </button>
                          
                          {user.role === 'pending' && (
                            <button
                              onClick={() => handleApproveUser(user.id, ROLES.ADVISOR)}
                              className="action-btn reset"
                              title="Approve"
                            >
                              <SafeIcon icon={FiUserCheck} className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            className="action-btn delete"
                            title="Deactivate"
                          >
                            <SafeIcon icon={FiUserX} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;