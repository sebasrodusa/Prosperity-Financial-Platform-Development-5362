import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCreditCard, FiPlus, FiTrash2, FiTrendingDown } = FiIcons;

const DebtStackingProgram = () => {
  const [debts, setDebts] = useState([]);
  const [extraPayment, setExtraPayment] = useState(0);
  const [strategy, setStrategy] = useState('avalanche'); // avalanche or snowball
  const [results, setResults] = useState(null);

  const addDebt = () => {
    const newDebt = {
      id: Date.now().toString(),
      name: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0
    };
    setDebts(prev => [...prev, newDebt]);
  };

  const removeDebt = (debtId) => {
    setDebts(prev => prev.filter(debt => debt.id !== debtId));
  };

  const updateDebt = (debtId, field, value) => {
    setDebts(prev =>
      prev.map(debt =>
        debt.id === debtId
          ? { ...debt, [field]: field === 'name' ? value : parseFloat(value) || 0 }
          : debt
      )
    );
  };

  const calculatePayoffStrategy = () => {
    if (debts.length === 0) return;

    const validDebts = debts.filter(debt => debt.balance > 0 && debt.minimumPayment > 0);
    if (validDebts.length === 0) return;

    // Sort debts based on strategy
    const sortedDebts = [...validDebts].sort((a, b) => {
      if (strategy === 'avalanche') {
        return b.interestRate - a.interestRate; // Highest interest first
      } else {
        return a.balance - b.balance; // Lowest balance first (snowball)
      }
    });

    // Calculate payoff timeline
    let totalMonths = 0;
    let totalInterestPaid = 0;
    let currentDebts = sortedDebts.map(debt => ({ ...debt }));
    let availableExtra = extraPayment;
    const payoffOrder = [];

    while (currentDebts.length > 0) {
      totalMonths++;
      
      // Make minimum payments on all debts
      currentDebts.forEach(debt => {
        const interestCharge = (debt.balance * debt.interestRate / 100) / 12;
        const principalPayment = Math.min(debt.minimumPayment - interestCharge, debt.balance);
        
        debt.balance -= principalPayment;
        totalInterestPaid += interestCharge;
        
        if (debt.balance < 0) debt.balance = 0;
      });

      // Apply extra payment to first debt (highest priority)
      if (availableExtra > 0 && currentDebts.length > 0) {
        const extraToApply = Math.min(availableExtra, currentDebts[0].balance);
        currentDebts[0].balance -= extraToApply;
      }

      // Remove paid off debts and add their minimum payment to extra payment pool
      const paidOffDebts = currentDebts.filter(debt => debt.balance <= 0);
      paidOffDebts.forEach(debt => {
        payoffOrder.push({
          name: debt.name,
          month: totalMonths,
          originalBalance: sortedDebts.find(d => d.id === debt.id).balance
        });
        availableExtra += debt.minimumPayment;
      });

      currentDebts = currentDebts.filter(debt => debt.balance > 0);

      // Safety check to prevent infinite loop
      if (totalMonths > 600) break; // 50 years max
    }

    setResults({
      totalMonths,
      totalInterestPaid,
      payoffOrder,
      monthlySavings: strategy === 'avalanche' ? calculateInterestSavings() : 0
    });
  };

  const calculateInterestSavings = () => {
    // Simplified calculation - in reality this would be more complex
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const avgInterestRate = debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length;
    return (totalDebt * avgInterestRate / 100) / 12;
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
          <SafeIcon icon={FiCreditCard} className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Debt Stacking Program</h2>
        <p className="text-gray-600 mt-2">
          Optimize your client's debt repayment strategy with avalanche or snowball method
        </p>
      </div>

      <div className="calculator-section">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Debt Information</h3>
          <button
            onClick={addDebt}
            className="btn-secondary flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Debt</span>
          </button>
        </div>

        {debts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <SafeIcon icon={FiCreditCard} className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No debts added yet. Click "Add Debt" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {debts.map((debt, index) => (
              <div key={debt.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Debt #{index + 1}</h4>
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="form-label">Debt Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                      placeholder="e.g., Credit Card, Student Loan"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Balance</label>
                    <input
                      type="number"
                      className="form-input"
                      value={debt.balance}
                      onChange={(e) => updateDebt(debt.id, 'balance', e.target.value)}
                      placeholder="Current balance"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Interest Rate (%)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={debt.interestRate}
                      onChange={(e) => updateDebt(debt.id, 'interestRate', e.target.value)}
                      placeholder="Annual rate"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Minimum Payment</label>
                    <input
                      type="number"
                      className="form-input"
                      value={debt.minimumPayment}
                      onChange={(e) => updateDebt(debt.id, 'minimumPayment', e.target.value)}
                      placeholder="Monthly minimum"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {debts.length > 0 && (
        <div className="calculator-section">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Settings</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Extra Monthly Payment</label>
              <input
                type="number"
                className="form-input"
                value={extraPayment}
                onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                placeholder="Additional payment amount"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payoff Strategy</label>
              <select
                className="form-select"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
              >
                <option value="avalanche">Debt Avalanche (Highest Interest First)</option>
                <option value="snowball">Debt Snowball (Lowest Balance First)</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={calculatePayoffStrategy}
              className="prosperity-button flex items-center space-x-2"
            >
              <SafeIcon icon={FiTrendingDown} className="w-5 h-5" />
              <span>Calculate Payoff Strategy</span>
            </button>
          </div>
        </div>
      )}

      {results && (
        <div className="debt-list">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payoff Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Payoff Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.floor(results.totalMonths / 12)} years {results.totalMonths % 12} months
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Interest Paid</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(results.totalInterestPaid)}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Monthly Savings Potential</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(results.monthlySavings)}
              </p>
            </div>
          </div>

          <div className="payoff-strategy">
            <h4 className="font-semibold text-gray-900 mb-3">Recommended Payoff Order</h4>
            <div className="space-y-2">
              {results.payoffOrder.map((debt, index) => (
                <div key={index} className="strategy-step">
                  <div className="step-number">{index + 1}</div>
                  <div className="flex-1">
                    <p className="font-medium">{debt.name}</p>
                    <p className="text-sm text-gray-600">
                      Paid off in month {debt.month} | Original balance: {formatCurrency(debt.originalBalance)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtStackingProgram;