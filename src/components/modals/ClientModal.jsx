import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX } = FiIcons;

const ClientModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { addClient } = useData();
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      maritalStatus: 'single',
      dependents: 0
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClient = {
      ...formData,
      userId: user.id,
      financialInfo: {
        income: {
          salary: 0,
          bonus: 0,
          investment: 0,
          other: 0
        },
        expenses: {
          housing: 0,
          transportation: 0,
          food: 0,
          utilities: 0,
          insurance: 0,
          entertainment: 0,
          other: 0
        },
        assets: {
          checking: 0,
          savings: 0,
          retirement: 0,
          investments: 0,
          realEstate: 0,
          other: 0
        },
        liabilities: {
          mortgage: 0,
          carLoans: 0,
          creditCards: 0,
          studentLoans: 0,
          other: 0
        }
      },
      goals: [],
      insurance: []
    };

    addClient(newClient);
    onClose();
    
    // Reset form
    setFormData({
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        maritalStatus: 'single',
        dependents: 0
      }
    });
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add New Client</h2>
          <button onClick={onClose} className="close-btn">
            <SafeIcon icon={FiX} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.personalInfo.firstName}
                onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.personalInfo.lastName}
                onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.personalInfo.email}
                onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-input"
                value={formData.personalInfo.phone}
                onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-input"
                value={formData.personalInfo.dateOfBirth}
                onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <select
                className="form-select"
                value={formData.personalInfo.maritalStatus}
                onChange={(e) => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-textarea"
              value={formData.personalInfo.address}
              onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Dependents</label>
            <input
              type="number"
              className="form-input"
              value={formData.personalInfo.dependents}
              onChange={(e) => handleInputChange('personalInfo', 'dependents', parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;