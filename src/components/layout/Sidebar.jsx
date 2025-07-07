import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUsers, FiFileText, FiSettings, FiLogOut, FiShield } = FiIcons;

const Sidebar = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      path: '/dashboard',
      icon: FiHome,
      label: 'Dashboard',
      permission: 'VIEW_CLIENTS'
    },
    {
      path: '/reports',
      icon: FiFileText,
      label: 'Reports',
      permission: 'VIEW_REPORTS'
    },
    {
      path: '/tools',
      icon: FiSettings,
      label: 'Tools',
      permission: 'ACCESS_TOOLS'
    }
  ];

  // Add admin route if user has admin permission
  if (hasPermission('VIEW_ADMIN_DASHBOARD')) {
    navItems.push({
      path: '/admin',
      icon: FiShield,
      label: 'Admin',
      permission: 'VIEW_ADMIN_DASHBOARD'
    });
  }

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold prosperity-logo">
          ProsperityChecker™
        </h1>
        <p className="text-sm text-gray-600 mt-1">Financial Management Platform</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            hasPermission(item.permission) && (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            )
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;