import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import ReportGenerator from '../components/reports/ReportGenerator';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiDownload, FiEye } = FiIcons;

const Reports = () => {
  const { user } = useAuth();
  const { clients, reports, getClientsByUserId } = useData();
  const [searchParams] = useSearchParams();
  const [selectedClient, setSelectedClient] = useState(searchParams.get('client') || '');

  const userClients = user?.role === 'admin' ? clients : getClientsByUserId(user?.id);
  const userReports = reports.filter(report => 
    user?.role === 'admin' ? true : report.userId === user?.id
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-2">
          <div className="prosperity-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h2>
            <ReportGenerator
              clients={userClients}
              selectedClient={selectedClient}
              onClientChange={setSelectedClient}
            />
          </div>
        </div>

        {/* Recent Reports */}
        <div className="prosperity-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
          {userReports.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon icon={FiFileText} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reports generated yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userReports.slice(0, 5).map((report) => {
                const client = clients.find(c => c.id === report.clientId);
                return (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {client?.personalInfo?.firstName} {client?.personalInfo?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(report.generatedAt)}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <SafeIcon icon={FiEye} className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <SafeIcon icon={FiDownload} className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* All Reports Table */}
      <div className="prosperity-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Reports</h2>
        {userReports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <SafeIcon icon={FiFileText} />
            </div>
            <h3>No Reports Generated</h3>
            <p>Generate your first financial report to get started.</p>
          </div>
        ) : (
          <div className="responsive-table">
            <table className="table-prosperity w-full">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Report Type</th>
                  <th>Generated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userReports.map((report) => {
                  const client = clients.find(c => c.id === report.clientId);
                  return (
                    <tr key={report.id}>
                      <td>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium text-sm">
                              {client?.personalInfo?.firstName?.charAt(0)}
                              {client?.personalInfo?.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {client?.personalInfo?.firstName} {client?.personalInfo?.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="capitalize">{report.type}</span>
                      </td>
                      <td>{formatDate(report.generatedAt)}</td>
                      <td>
                        <span className="badge-success">
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button className="action-btn view">
                            <SafeIcon icon={FiEye} className="w-4 h-4" />
                          </button>
                          <button className="action-btn view">
                            <SafeIcon icon={FiDownload} className="w-4 h-4" />
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
    </div>
  );
};

export default Reports;