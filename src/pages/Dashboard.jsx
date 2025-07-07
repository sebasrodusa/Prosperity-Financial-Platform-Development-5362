import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import ClientModal from '../components/modals/ClientModal';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiUser, FiDollarSign, FiTrendingUp, FiFileText, FiEdit, FiTrash2 } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { clients, getClientsByUserId, calculateNetIncome, calculateNetWorth } = useData();
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const navigate = useNavigate();

  const userClients = user?.role === 'admin' ? clients : getClientsByUserId(user?.id);

  const totalClients = userClients.length;
  const totalNetWorth = userClients.reduce((sum, client) => {
    return sum + calculateNetWorth(client.financialInfo?.assets || {}, client.financialInfo?.liabilities || {});
  }, 0);

  const averageNetWorth = totalClients > 0 ? totalNetWorth / totalClients : 0;

  const handleClientClick = (clientId) => {
    navigate(`/client/${clientId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Net Worth</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalNetWorth)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Net Worth</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageNetWorth)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Client Portfolio</h2>
        <button
          onClick={() => setIsClientModalOpen(true)}
          className="prosperity-button flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Clients Table */}
      <div className="prosperity-card">
        {userClients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <SafeIcon icon={FiUser} />
            </div>
            <h3>No Clients Yet</h3>
            <p>Start building your client portfolio by adding your first client.</p>
            <button
              onClick={() => setIsClientModalOpen(true)}
              className="prosperity-button"
            >
              Add First Client
            </button>
          </div>
        ) : (
          <div className="responsive-table">
            <table className="table-prosperity w-full">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Net Worth</th>
                  <th>Monthly Income</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userClients.map((client) => {
                  const netWorth = calculateNetWorth(
                    client.financialInfo?.assets || {},
                    client.financialInfo?.liabilities || {}
                  );
                  const netIncome = calculateNetIncome(
                    client.financialInfo?.income || {},
                    client.financialInfo?.expenses || {}
                  );

                  return (
                    <tr key={client.id} className="cursor-pointer hover:bg-gray-50">
                      <td onClick={() => handleClientClick(client.id)}>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">
                              {client.personalInfo?.firstName?.charAt(0)}
                              {client.personalInfo?.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {client.personalInfo?.firstName} {client.personalInfo?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {client.personalInfo?.maritalStatus || 'Single'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td onClick={() => handleClientClick(client.id)}>
                        {client.personalInfo?.email}
                      </td>
                      <td onClick={() => handleClientClick(client.id)}>
                        <span className={`font-medium ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(netWorth)}
                        </span>
                      </td>
                      <td onClick={() => handleClientClick(client.id)}>
                        <span className={`font-medium ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(netIncome)}
                        </span>
                      </td>
                      <td onClick={() => handleClientClick(client.id)}>
                        {new Date(client.updatedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClientClick(client.id);
                            }}
                            className="action-btn view"
                          >
                            <SafeIcon icon={FiEdit} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/reports?client=${client.id}`);
                            }}
                            className="action-btn view"
                          >
                            <SafeIcon icon={FiFileText} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;