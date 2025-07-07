import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiDownload, FiEye } = FiIcons;

const ReportGenerator = ({ clients, selectedClient, onClientChange }) => {
  const { addReport, calculateNetIncome, calculateNetWorth } = useData();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('comprehensive');
  const [showPreview, setShowPreview] = useState(false);

  const client = clients.find(c => c.id === selectedClient);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generatePDF = async () => {
    if (!client) return;

    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(30, 64, 175); // Navy blue
      doc.text('ProsperityChecker™', 20, 20);
      doc.setFontSize(16);
      doc.text('Financial Analysis Report', 20, 30);
      
      // Client Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Client: ${client.personalInfo?.firstName} ${client.personalInfo?.lastName}`, 20, 50);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 60);
      doc.text(`Prepared by: ${user?.name}`, 20, 70);
      
      // Financial Summary
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('Financial Summary', 20, 90);
      
      const netIncome = calculateNetIncome(client.financialInfo?.income || {}, client.financialInfo?.expenses || {});
      const netWorth = calculateNetWorth(client.financialInfo?.assets || {}, client.financialInfo?.liabilities || {});
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Net Monthly Income: ${formatCurrency(netIncome)}`, 20, 105);
      doc.text(`Net Worth: ${formatCurrency(netWorth)}`, 20, 115);
      
      // Income Breakdown
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('Income Breakdown', 20, 135);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      let yPos = 150;
      Object.entries(client.financialInfo?.income || {}).forEach(([key, value]) => {
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatCurrency(value)}`, 20, yPos);
        yPos += 10;
      });
      
      // Expenses Breakdown
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('Expenses Breakdown', 20, yPos + 10);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPos += 25;
      Object.entries(client.financialInfo?.expenses || {}).forEach(([key, value]) => {
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatCurrency(value)}`, 20, yPos);
        yPos += 10;
      });
      
      // Add new page for assets and liabilities
      doc.addPage();
      
      // Assets
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('Assets', 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPos = 35;
      Object.entries(client.financialInfo?.assets || {}).forEach(([key, value]) => {
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatCurrency(value)}`, 20, yPos);
        yPos += 10;
      });
      
      // Liabilities
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text('Liabilities', 20, yPos + 10);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPos += 25;
      Object.entries(client.financialInfo?.liabilities || {}).forEach(([key, value]) => {
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatCurrency(value)}`, 20, yPos);
        yPos += 10;
      });
      
      // Goals
      if (client.goals && client.goals.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(30, 64, 175);
        doc.text('Financial Goals', 20, yPos + 15);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        yPos += 30;
        client.goals.forEach((goal, index) => {
          const progress = Math.round((goal.current / goal.target) * 100);
          doc.text(`${index + 1}. ${goal.name}`, 20, yPos);
          doc.text(`Target: ${formatCurrency(goal.target)} | Current: ${formatCurrency(goal.current)} | Progress: ${progress}%`, 25, yPos + 8);
          yPos += 20;
        });
      }
      
      // Save PDF
      doc.save(`${client.personalInfo?.firstName}_${client.personalInfo?.lastName}_Financial_Report.pdf`);
      
      // Add report to database
      addReport({
        clientId: client.id,
        userId: user.id,
        title: `Financial Analysis Report - ${client.personalInfo?.firstName} ${client.personalInfo?.lastName}`,
        type: reportType
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Select Client</label>
          <select
            className="form-select"
            value={selectedClient}
            onChange={(e) => onClientChange(e.target.value)}
          >
            <option value="">Choose a client...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.personalInfo?.firstName} {client.personalInfo?.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Report Type</label>
          <select
            className="form-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="comprehensive">Comprehensive Analysis</option>
            <option value="summary">Executive Summary</option>
            <option value="goals">Goals Progress</option>
            <option value="insurance">Insurance Review</option>
          </select>
        </div>
      </div>

      {selectedClient && (
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary flex items-center space-x-2"
          >
            <SafeIcon icon={FiEye} className="w-5 h-5" />
            <span>{showPreview ? 'Hide Preview' : 'Preview Report'}</span>
          </button>

          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="prosperity-button flex items-center space-x-2"
          >
            <SafeIcon icon={FiDownload} className="w-5 h-5" />
            <span>{isGenerating ? 'Generating...' : 'Generate PDF'}</span>
          </button>
        </div>
      )}

      {showPreview && client && (
        <div className="report-preview">
          <div className="report-header">
            <h1 className="text-2xl font-bold prosperity-logo">ProsperityChecker™</h1>
            <h2 className="text-xl font-semibold text-gray-700">Financial Analysis Report</h2>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Client:</strong> {client.personalInfo?.firstName} {client.personalInfo?.lastName}</p>
              <p><strong>Report Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Prepared by:</strong> {user?.name}</p>
            </div>
          </div>

          <div className="report-section">
            <h3>Financial Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Net Monthly Income:</strong> {formatCurrency(calculateNetIncome(client.financialInfo?.income || {}, client.financialInfo?.expenses || {}))}</p>
                <p><strong>Net Worth:</strong> {formatCurrency(calculateNetWorth(client.financialInfo?.assets || {}, client.financialInfo?.liabilities || {}))}</p>
              </div>
            </div>
          </div>

          <div className="report-section">
            <h3>Income Breakdown</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(client.financialInfo?.income || {}).map(([key, value]) => (
                  <tr key={key}>
                    <td className="capitalize">{key}</td>
                    <td>{formatCurrency(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-section">
            <h3>Expenses Breakdown</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(client.financialInfo?.expenses || {}).map(([key, value]) => (
                  <tr key={key}>
                    <td className="capitalize">{key}</td>
                    <td>{formatCurrency(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-section">
            <h3>Assets</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset Type</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(client.financialInfo?.assets || {}).map(([key, value]) => (
                  <tr key={key}>
                    <td className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                    <td>{formatCurrency(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-section">
            <h3>Liabilities</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Liability Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(client.financialInfo?.liabilities || {}).map(([key, value]) => (
                  <tr key={key}>
                    <td className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                    <td>{formatCurrency(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {client.goals && client.goals.length > 0 && (
            <div className="report-section">
              <h3>Financial Goals</h3>
              <div className="space-y-4">
                {client.goals.map((goal, index) => {
                  const progress = Math.round((goal.current / goal.target) * 100);
                  return (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{goal.name}</h4>
                        <span className="text-sm text-gray-500">{progress}% Complete</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Target</p>
                          <p className="font-medium">{formatCurrency(goal.target)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Current</p>
                          <p className="font-medium">{formatCurrency(goal.current)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Deadline</p>
                          <p className="font-medium">{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;