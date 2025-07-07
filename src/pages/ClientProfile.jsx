import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import ClientForm from '../components/forms/ClientForm';
import FinancialSummary from '../components/client/FinancialSummary';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiEdit, FiFileText, FiSave } = FiIcons;

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, updateClient } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const client = clients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Client Not Found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="prosperity-button"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleSave = (data) => {
    updateClient(id, data);
    setIsEditing(false);
    setFormData(null);
  };

  const handleEdit = () => {
    setFormData(client);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {client.personalInfo?.firstName} {client.personalInfo?.lastName}
            </h1>
            <p className="text-gray-600">Client Profile</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="prosperity-button flex items-center space-x-2"
              >
                <SafeIcon icon={FiEdit} className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => navigate(`/reports?client=${id}`)}
                className="btn-secondary flex items-center space-x-2"
              >
                <SafeIcon icon={FiFileText} className="w-5 h-5" />
                <span>Generate Report</span>
              </button>
            </>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // This will be handled by the form
                }}
                className="prosperity-button flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <FinancialSummary client={client} />

      {/* Client Form */}
      <ClientForm
        client={isEditing ? formData : client}
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ClientProfile;