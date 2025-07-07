import React, { useState } from 'react';
import LifeInsuranceCalculator from '../components/tools/LifeInsuranceCalculator';
import DebtStackingProgram from '../components/tools/DebtStackingProgram';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiCreditCard, FiCalculator, FiTrendingDown } = FiIcons;

const Tools = () => {
  const [activeTab, setActiveTab] = useState('life-insurance');

  const tools = [
    {
      id: 'life-insurance',
      name: 'Life Insurance Calculator',
      icon: FiShield,
      description: 'Calculate optimal life insurance coverage based on financial needs',
      component: LifeInsuranceCalculator
    },
    {
      id: 'debt-stacking',
      name: 'Debt Stacking Program',
      icon: FiCreditCard,
      description: 'Optimize debt repayment strategy to save money and pay off faster',
      component: DebtStackingProgram
    }
  ];

  const ActiveComponent = tools.find(tool => tool.id === activeTab)?.component;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Tools</h1>
        <p className="text-gray-600 mt-2">
          Use these professional tools to help your clients make informed financial decisions
        </p>
      </div>

      {/* Tool Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                activeTab === tool.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={tool.icon} className="w-5 h-5" />
              <span className="font-medium">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tool Content */}
      <div className="prosperity-card">
        {ActiveComponent && <ActiveComponent />}
      </div>

      {/* Tool Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className="prosperity-card">
            <div className="flex items-start space-x-4">
              <div className="tool-icon">
                <SafeIcon icon={tool.icon} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {tool.description}
                </p>
                <button
                  onClick={() => setActiveTab(tool.id)}
                  className={`btn-secondary ${
                    activeTab === tool.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={activeTab === tool.id}
                >
                  {activeTab === tool.id ? 'Currently Active' : 'Use This Tool'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tools;