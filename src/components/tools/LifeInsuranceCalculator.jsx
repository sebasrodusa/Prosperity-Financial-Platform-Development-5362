import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiCalculator } = FiIcons;

const LifeInsuranceCalculator = () => {
  const [formData, setFormData] = useState({
    annualIncome: 0,
    yearsToReplace: 10,
    currentSavings: 0,
    existingCoverage: 0,
    finalExpenses: 15000,
    debts: 0,
    dependents: 0,
    spouseIncome: 0
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateCoverage = () => {
    const {
      annualIncome,
      yearsToReplace,
      currentSavings,
      existingCoverage,
      finalExpenses,
      debts,
      spouseIncome
    } = formData;

    // Income replacement calculation
    const incomeReplacement = (annualIncome - spouseIncome) * yearsToReplace;
    
    // Total needs
    const totalNeeds = incomeReplacement + finalExpenses + debts;
    
    // Available resources
    const availableResources = currentSavings + existingCoverage;
    
    // Required additional coverage
    const requiredCoverage = Math.max(0, totalNeeds - availableResources);

    setResult({
      incomeReplacement,
      totalNeeds,
      availableResources,
      requiredCoverage,
      monthlyPremiumEstimate: requiredCoverage * 0.001 // Rough estimate
    });
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
      <div className="text-center">
        <div className="tool-icon mx-auto">
          <SafeIcon icon={FiShield} className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Life Insurance Needs Calculator</h2>
        <p className="text-gray-600 mt-2">
          Calculate the optimal life insurance coverage for your client's financial security
        </p>
      </div>

      <div className="calculator-section">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Annual Income</label>
            <input
              type="number"
              className="form-input"
              value={formData.annualIncome}
              onChange={(e) => handleInputChange('annualIncome', e.target.value)}
              placeholder="Enter annual income"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Years to Replace Income</label>
            <input
              type="number"
              className="form-input"
              value={formData.yearsToReplace}
              onChange={(e) => handleInputChange('yearsToReplace', e.target.value)}
              placeholder="Enter years"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Savings & Investments</label>
            <input
              type="number"
              className="form-input"
              value={formData.currentSavings}
              onChange={(e) => handleInputChange('currentSavings', e.target.value)}
              placeholder="Enter current savings"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Existing Life Insurance</label>
            <input
              type="number"
              className="form-input"
              value={formData.existingCoverage}
              onChange={(e) => handleInputChange('existingCoverage', e.target.value)}
              placeholder="Enter existing coverage"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Final Expenses</label>
            <input
              type="number"
              className="form-input"
              value={formData.finalExpenses}
              onChange={(e) => handleInputChange('finalExpenses', e.target.value)}
              placeholder="Enter final expenses"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Outstanding Debts</label>
            <input
              type="number"
              className="form-input"
              value={formData.debts}
              onChange={(e) => handleInputChange('debts', e.target.value)}
              placeholder="Enter total debts"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Dependents</label>
            <input
              type="number"
              className="form-input"
              value={formData.dependents}
              onChange={(e) => handleInputChange('dependents', e.target.value)}
              placeholder="Enter number of dependents"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Spouse Annual Income</label>
            <input
              type="number"
              className="form-input"
              value={formData.spouseIncome}
              onChange={(e) => handleInputChange('spouseIncome', e.target.value)}
              placeholder="Enter spouse income"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={calculateCoverage}
            className="prosperity-button flex items-center space-x-2"
          >
            <SafeIcon icon={FiCalculator} className="w-5 h-5" />
            <span>Calculate Coverage Needed</span>
          </button>
        </div>
      </div>

      {result && (
        <div className="calculator-result">
          <h3 className="text-xl font-semibold mb-4">Recommended Coverage</h3>
          <div className="result-amount">{formatCurrency(result.requiredCoverage)}</div>
          <div className="result-label">Additional Life Insurance Needed</div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Income Replacement:</span>
                  <span>{formatCurrency(result.incomeReplacement)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Expenses:</span>
                  <span>{formatCurrency(formData.finalExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Outstanding Debts:</span>
                  <span>{formatCurrency(formData.debts)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-white border-opacity-30 pt-2">
                  <span>Total Needs:</span>
                  <span>{formatCurrency(result.totalNeeds)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Available Resources</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current Savings:</span>
                  <span>{formatCurrency(formData.currentSavings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Existing Coverage:</span>
                  <span>{formatCurrency(formData.existingCoverage)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-white border-opacity-30 pt-2">
                  <span>Total Resources:</span>
                  <span>{formatCurrency(result.availableResources)}</span>
                </div>
                <div className="flex justify-between text-sm mt-4">
                  <span>Est. Monthly Premium:</span>
                  <span>{formatCurrency(result.monthlyPremiumEstimate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeInsuranceCalculator;