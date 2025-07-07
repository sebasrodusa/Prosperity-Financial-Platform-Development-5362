import React from 'react';
import { useData } from '../../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiTrendingUp, FiTrendingDown, FiTarget } = FiIcons;

const FinancialSummary = ({ client }) => {
  const { calculateNetIncome, calculateNetWorth } = useData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalIncome = Object.values(client.financialInfo?.income || {}).reduce((sum, val) => sum + (val || 0), 0);
  const totalExpenses = Object.values(client.financialInfo?.expenses || {}).reduce((sum, val) => sum + (val || 0), 0);
  const totalAssets = Object.values(client.financialInfo?.assets || {}).reduce((sum, val) => sum + (val || 0), 0);
  const totalLiabilities = Object.values(client.financialInfo?.liabilities || {}).reduce((sum, val) => sum + (val || 0), 0);

  const netIncome = calculateNetIncome(client.financialInfo?.income || {}, client.financialInfo?.expenses || {});
  const netWorth = calculateNetWorth(client.financialInfo?.assets || {}, client.financialInfo?.liabilities || {});

  const goalProgress = client.goals?.reduce((sum, goal) => {
    return sum + (goal.current / goal.target) * 100;
  }, 0) / (client.goals?.length || 1);

  return (
    <div className="financial-summary">
      <h2>Financial Overview</h2>
      <div className="summary-grid">
        <div className="summary-item">
          <div className="flex items-center justify-between">
            <div>
              <h4>Monthly Income</h4>
              <p>{formatCurrency(totalIncome)}</p>
            </div>
            <SafeIcon icon={FiDollarSign} className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="summary-item">
          <div className="flex items-center justify-between">
            <div>
              <h4>Monthly Expenses</h4>
              <p>{formatCurrency(totalExpenses)}</p>
            </div>
            <SafeIcon icon={FiTrendingDown} className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="summary-item">
          <div className="flex items-center justify-between">
            <div>
              <h4>Net Income</h4>
              <p className={netIncome >= 0 ? 'text-green-200' : 'text-red-200'}>
                {formatCurrency(netIncome)}
              </p>
            </div>
            <SafeIcon icon={netIncome >= 0 ? FiTrendingUp : FiTrendingDown} className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="summary-item">
          <div className="flex items-center justify-between">
            <div>
              <h4>Total Assets</h4>
              <p>{formatCurrency(totalAssets)}</p>
            </div>
            <SafeIcon icon={FiDollarSign} className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="summary-item">
          <div className="flex items-center justify-between">
            <div>
              <h4>Total Liabilities</h4>
              <p>{formatCurrency(totalLiabilities)}</p>
            </div>
            <SafeIcon icon={FiTrendingDown} className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="summary-item">
          <div className="flex items-center justify-between">
            <div>
              <h4>Net Worth</h4>
              <p className={netWorth >= 0 ? 'text-green-200' : 'text-red-200'}>
                {formatCurrency(netWorth)}
              </p>
            </div>
            <SafeIcon icon={netWorth >= 0 ? FiTrendingUp : FiTrendingDown} className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="summary-item">
          <div className="flex items-center justify-between">
            <div>
              <h4>Goal Progress</h4>
              <p>{Math.round(goalProgress)}%</p>
            </div>
            <SafeIcon icon={FiTarget} className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="summary-item">
          <div className="flex items-center justify-between">
            <div>
              <h4>Active Goals</h4>
              <p>{client.goals?.length || 0}</p>
            </div>
            <SafeIcon icon={FiTarget} className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;