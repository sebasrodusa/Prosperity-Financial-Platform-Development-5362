import React, { useState, useEffect } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2 } = FiIcons;

const ClientForm = ({ client, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(client || {});

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: typeof value === 'string' && !isNaN(value) && value !== '' ? parseFloat(value) : value
      }
    }));
  };

  const addGoal = () => {
    const newGoal = {
      id: Date.now().toString(),
      name: '',
      target: 0,
      current: 0,
      deadline: ''
    };
    setFormData(prev => ({
      ...prev,
      goals: [...(prev.goals || []), newGoal]
    }));
  };

  const removeGoal = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }));
  };

  const updateGoal = (goalId, field, value) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId
          ? { ...goal, [field]: field === 'target' || field === 'current' ? parseFloat(value) || 0 : value }
          : goal
      )
    }));
  };

  const addInsurance = () => {
    const newInsurance = {
      id: Date.now().toString(),
      type: '',
      provider: '',
      coverage: 0,
      premium: 0,
      frequency: 'monthly'
    };
    setFormData(prev => ({
      ...prev,
      insurance: [...(prev.insurance || []), newInsurance]
    }));
  };

  const removeInsurance = (insuranceId) => {
    setFormData(prev => ({
      ...prev,
      insurance: prev.insurance.filter(ins => ins.id !== insuranceId)
    }));
  };

  const updateInsurance = (insuranceId, field, value) => {
    setFormData(prev => ({
      ...prev,
      insurance: prev.insurance.map(ins =>
        ins.id === insuranceId
          ? { ...ins, [field]: field === 'coverage' || field === 'premium' ? parseFloat(value) || 0 : value }
          : ins
      )
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div>
              <label className="form-label">First Name</label>
              <p className="text-gray-900">{formData.personalInfo?.firstName || 'N/A'}</p>
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <p className="text-gray-900">{formData.personalInfo?.lastName || 'N/A'}</p>
            </div>
            <div>
              <label className="form-label">Email</label>
              <p className="text-gray-900">{formData.personalInfo?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="form-label">Phone</label>
              <p className="text-gray-900">{formData.personalInfo?.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="form-label">Date of Birth</label>
              <p className="text-gray-900">
                {formData.personalInfo?.dateOfBirth ? new Date(formData.personalInfo.dateOfBirth).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="form-label">Marital Status</label>
              <p className="text-gray-900 capitalize">{formData.personalInfo?.maritalStatus || 'N/A'}</p>
            </div>
          </div>
          <div>
            <label className="form-label">Address</label>
            <p className="text-gray-900">{formData.personalInfo?.address || 'N/A'}</p>
          </div>
          <div>
            <label className="form-label">Dependents</label>
            <p className="text-gray-900">{formData.personalInfo?.dependents || 0}</p>
          </div>
        </div>

        {/* Financial Information */}
        <div className="form-section">
          <h3>Income</h3>
          <div className="form-grid">
            <div>
              <label className="form-label">Salary</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.income?.salary || 0)}</p>
            </div>
            <div>
              <label className="form-label">Bonus</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.income?.bonus || 0)}</p>
            </div>
            <div>
              <label className="form-label">Investment Income</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.income?.investment || 0)}</p>
            </div>
            <div>
              <label className="form-label">Other Income</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.income?.other || 0)}</p>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Expenses</h3>
          <div className="form-grid">
            <div>
              <label className="form-label">Housing</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.expenses?.housing || 0)}</p>
            </div>
            <div>
              <label className="form-label">Transportation</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.expenses?.transportation || 0)}</p>
            </div>
            <div>
              <label className="form-label">Food</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.expenses?.food || 0)}</p>
            </div>
            <div>
              <label className="form-label">Utilities</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.expenses?.utilities || 0)}</p>
            </div>
            <div>
              <label className="form-label">Insurance</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.expenses?.insurance || 0)}</p>
            </div>
            <div>
              <label className="form-label">Entertainment</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.expenses?.entertainment || 0)}</p>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Assets</h3>
          <div className="form-grid">
            <div>
              <label className="form-label">Checking Account</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.assets?.checking || 0)}</p>
            </div>
            <div>
              <label className="form-label">Savings Account</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.assets?.savings || 0)}</p>
            </div>
            <div>
              <label className="form-label">Retirement Accounts</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.assets?.retirement || 0)}</p>
            </div>
            <div>
              <label className="form-label">Investments</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.assets?.investments || 0)}</p>
            </div>
            <div>
              <label className="form-label">Real Estate</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.assets?.realEstate || 0)}</p>
            </div>
            <div>
              <label className="form-label">Other Assets</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.assets?.other || 0)}</p>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Liabilities</h3>
          <div className="form-grid">
            <div>
              <label className="form-label">Mortgage</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.liabilities?.mortgage || 0)}</p>
            </div>
            <div>
              <label className="form-label">Car Loans</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.liabilities?.carLoans || 0)}</p>
            </div>
            <div>
              <label className="form-label">Credit Cards</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.liabilities?.creditCards || 0)}</p>
            </div>
            <div>
              <label className="form-label">Student Loans</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.liabilities?.studentLoans || 0)}</p>
            </div>
            <div>
              <label className="form-label">Other Debts</label>
              <p className="text-gray-900">{formatCurrency(formData.financialInfo?.liabilities?.other || 0)}</p>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="form-section">
          <h3>Financial Goals</h3>
          {formData.goals && formData.goals.length > 0 ? (
            <div className="space-y-4">
              {formData.goals.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="form-label">Goal Name</label>
                      <p className="text-gray-900">{goal.name}</p>
                    </div>
                    <div>
                      <label className="form-label">Target Amount</label>
                      <p className="text-gray-900">{formatCurrency(goal.target)}</p>
                    </div>
                    <div>
                      <label className="form-label">Current Amount</label>
                      <p className="text-gray-900">{formatCurrency(goal.current)}</p>
                    </div>
                    <div>
                      <label className="form-label">Target Date</label>
                      <p className="text-gray-900">
                        {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.round((goal.current / goal.target) * 100)}% Complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No goals set</p>
          )}
        </div>

        {/* Insurance */}
        <div className="form-section">
          <h3>Insurance Policies</h3>
          {formData.insurance && formData.insurance.length > 0 ? (
            <div className="space-y-4">
              {formData.insurance.map((policy) => (
                <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="form-label">Type</label>
                      <p className="text-gray-900">{policy.type}</p>
                    </div>
                    <div>
                      <label className="form-label">Provider</label>
                      <p className="text-gray-900">{policy.provider}</p>
                    </div>
                    <div>
                      <label className="form-label">Coverage</label>
                      <p className="text-gray-900">{formatCurrency(policy.coverage)}</p>
                    </div>
                    <div>
                      <label className="form-label">Premium</label>
                      <p className="text-gray-900">{formatCurrency(policy.premium)}</p>
                    </div>
                    <div>
                      <label className="form-label">Frequency</label>
                      <p className="text-gray-900 capitalize">{policy.frequency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No insurance policies</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.personalInfo?.firstName || ''}
              onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.personalInfo?.lastName || ''}
              onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.personalInfo?.email || ''}
              onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.personalInfo?.phone || ''}
              onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-input"
              value={formData.personalInfo?.dateOfBirth || ''}
              onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Marital Status</label>
            <select
              className="form-select"
              value={formData.personalInfo?.maritalStatus || 'single'}
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
            value={formData.personalInfo?.address || ''}
            onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
            rows="3"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Number of Dependents</label>
          <input
            type="number"
            className="form-input"
            value={formData.personalInfo?.dependents || 0}
            onChange={(e) => handleInputChange('personalInfo', 'dependents', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
      </div>

      {/* Financial Information - Income */}
      <div className="form-section">
        <h3>Monthly Income</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Salary</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.income?.salary || ''}
              onChange={(e) => handleInputChange('financialInfo', 'income', {
                ...formData.financialInfo?.income,
                salary: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Bonus</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.income?.bonus || ''}
              onChange={(e) => handleInputChange('financialInfo', 'income', {
                ...formData.financialInfo?.income,
                bonus: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Investment Income</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.income?.investment || ''}
              onChange={(e) => handleInputChange('financialInfo', 'income', {
                ...formData.financialInfo?.income,
                investment: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Other Income</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.income?.other || ''}
              onChange={(e) => handleInputChange('financialInfo', 'income', {
                ...formData.financialInfo?.income,
                other: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Financial Information - Expenses */}
      <div className="form-section">
        <h3>Monthly Expenses</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Housing</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.expenses?.housing || ''}
              onChange={(e) => handleInputChange('financialInfo', 'expenses', {
                ...formData.financialInfo?.expenses,
                housing: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Transportation</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.expenses?.transportation || ''}
              onChange={(e) => handleInputChange('financialInfo', 'expenses', {
                ...formData.financialInfo?.expenses,
                transportation: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Food</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.expenses?.food || ''}
              onChange={(e) => handleInputChange('financialInfo', 'expenses', {
                ...formData.financialInfo?.expenses,
                food: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Utilities</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.expenses?.utilities || ''}
              onChange={(e) => handleInputChange('financialInfo', 'expenses', {
                ...formData.financialInfo?.expenses,
                utilities: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Insurance</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.expenses?.insurance || ''}
              onChange={(e) => handleInputChange('financialInfo', 'expenses', {
                ...formData.financialInfo?.expenses,
                insurance: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Entertainment</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.expenses?.entertainment || ''}
              onChange={(e) => handleInputChange('financialInfo', 'expenses', {
                ...formData.financialInfo?.expenses,
                entertainment: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="form-section">
        <h3>Assets</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Checking Account</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.assets?.checking || ''}
              onChange={(e) => handleInputChange('financialInfo', 'assets', {
                ...formData.financialInfo?.assets,
                checking: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Savings Account</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.assets?.savings || ''}
              onChange={(e) => handleInputChange('financialInfo', 'assets', {
                ...formData.financialInfo?.assets,
                savings: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Retirement Accounts</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.assets?.retirement || ''}
              onChange={(e) => handleInputChange('financialInfo', 'assets', {
                ...formData.financialInfo?.assets,
                retirement: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Investments</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.assets?.investments || ''}
              onChange={(e) => handleInputChange('financialInfo', 'assets', {
                ...formData.financialInfo?.assets,
                investments: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Real Estate</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.assets?.realEstate || ''}
              onChange={(e) => handleInputChange('financialInfo', 'assets', {
                ...formData.financialInfo?.assets,
                realEstate: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Other Assets</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.assets?.other || ''}
              onChange={(e) => handleInputChange('financialInfo', 'assets', {
                ...formData.financialInfo?.assets,
                other: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Liabilities */}
      <div className="form-section">
        <h3>Liabilities</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Mortgage</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.liabilities?.mortgage || ''}
              onChange={(e) => handleInputChange('financialInfo', 'liabilities', {
                ...formData.financialInfo?.liabilities,
                mortgage: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Car Loans</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.liabilities?.carLoans || ''}
              onChange={(e) => handleInputChange('financialInfo', 'liabilities', {
                ...formData.financialInfo?.liabilities,
                carLoans: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Credit Cards</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.liabilities?.creditCards || ''}
              onChange={(e) => handleInputChange('financialInfo', 'liabilities', {
                ...formData.financialInfo?.liabilities,
                creditCards: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Student Loans</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.liabilities?.studentLoans || ''}
              onChange={(e) => handleInputChange('financialInfo', 'liabilities', {
                ...formData.financialInfo?.liabilities,
                studentLoans: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Other Debts</label>
            <input
              type="number"
              className="form-input"
              value={formData.financialInfo?.liabilities?.other || ''}
              onChange={(e) => handleInputChange('financialInfo', 'liabilities', {
                ...formData.financialInfo?.liabilities,
                other: parseFloat(e.target.value) || 0
              })}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="form-section">
        <div className="flex items-center justify-between mb-4">
          <h3>Financial Goals</h3>
          <button
            type="button"
            onClick={addGoal}
            className="btn-secondary flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>
        {formData.goals && formData.goals.length > 0 ? (
          <div className="space-y-4">
            {formData.goals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Goal #{formData.goals.indexOf(goal) + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeGoal(goal.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Goal Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={goal.name}
                      onChange={(e) => updateGoal(goal.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Amount</label>
                    <input
                      type="number"
                      className="form-input"
                      value={goal.target}
                      onChange={(e) => updateGoal(goal.id, 'target', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Amount</label>
                    <input
                      type="number"
                      className="form-input"
                      value={goal.current}
                      onChange={(e) => updateGoal(goal.id, 'current', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={goal.deadline}
                      onChange={(e) => updateGoal(goal.id, 'deadline', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No goals added yet. Click "Add Goal" to get started.</p>
        )}
      </div>

      {/* Insurance */}
      <div className="form-section">
        <div className="flex items-center justify-between mb-4">
          <h3>Insurance Policies</h3>
          <button
            type="button"
            onClick={addInsurance}
            className="btn-secondary flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Policy</span>
          </button>
        </div>
        {formData.insurance && formData.insurance.length > 0 ? (
          <div className="space-y-4">
            {formData.insurance.map((policy) => (
              <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Policy #{formData.insurance.indexOf(policy) + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeInsurance(policy.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <input
                      type="text"
                      className="form-input"
                      value={policy.type}
                      onChange={(e) => updateInsurance(policy.id, 'type', e.target.value)}
                      placeholder="e.g., Life Insurance, Health Insurance"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Provider</label>
                    <input
                      type="text"
                      className="form-input"
                      value={policy.provider}
                      onChange={(e) => updateInsurance(policy.id, 'provider', e.target.value)}
                      placeholder="Insurance company name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Coverage Amount</label>
                    <input
                      type="number"
                      className="form-input"
                      value={policy.coverage}
                      onChange={(e) => updateInsurance(policy.id, 'coverage', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Premium Amount</label>
                    <input
                      type="number"
                      className="form-input"
                      value={policy.premium}
                      onChange={(e) => updateInsurance(policy.id, 'premium', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">Payment Frequency</label>
                    <select
                      className="form-select"
                      value={policy.frequency}
                      onChange={(e) => updateInsurance(policy.id, 'frequency', e.target.value)}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="semi-annual">Semi-Annual</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No insurance policies added yet. Click "Add Policy" to get started.</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ClientForm;