import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiLock, FiLogIn, FiUserPlus } = FiIcons;

const Login = () => {
  const navigate = useNavigate();
  const { login, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Failed to log in. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const result = await login(demoEmail, demoPassword);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Failed to log in. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Section: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-prosperity-navy to-prosperity-blue p-12 flex-col justify-between">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">ProsperityChecker™</h1>
          <p className="text-xl opacity-80">Your complete financial management solution</p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <SafeIcon icon={FiLogIn} className="text-white w-4 h-4" />
              </div>
              <p>Secure client data management</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <SafeIcon icon={FiLogIn} className="text-white w-4 h-4" />
              </div>
              <p>Advanced financial planning tools</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <SafeIcon icon={FiLogIn} className="text-white w-4 h-4" />
              </div>
              <p>Comprehensive reporting capabilities</p>
            </div>
          </div>
        </div>
        <div className="text-white opacity-70">
          <p className="text-sm">© 2024 ProsperityChecker. All rights reserved.</p>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to access your account</p>
          </div>

          {(error || authError) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error || authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex justify-end mt-1">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="prosperity-button w-full py-3 flex items-center justify-center"
            >
              {loading ? (
                <div className="loading-spinner mr-2"></div>
              ) : (
                <SafeIcon icon={FiLogIn} className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center text-sm text-gray-600">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Accounts Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-center text-sm font-medium text-gray-700 mb-4">Demo Accounts</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('sebasrodus+admin@gmail.com', 'demo123')}
                  className="w-full p-3 bg-purple-50 border border-purple-200 rounded-lg text-left hover:bg-purple-100 transition-colors"
                  disabled={loading}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-purple-900">Admin Account</p>
                      <p className="text-sm text-purple-600">Full system access</p>
                    </div>
                    <div className="text-xs text-purple-500">
                      <p>sebasrodus+admin@gmail.com</p>
                      <p>demo123</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('advisor@prosperity.com', 'demo123')}
                  className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors"
                  disabled={loading}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">Advisor Account</p>
                      <p className="text-sm text-blue-600">Client management & reports</p>
                    </div>
                    <div className="text-xs text-blue-500">
                      <p>advisor@prosperity.com</p>
                      <p>demo123</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('client@prosperity.com', 'demo123')}
                  className="w-full p-3 bg-green-50 border border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors"
                  disabled={loading}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">Client Account</p>
                      <p className="text-sm text-green-600">Limited access</p>
                    </div>
                    <div className="text-xs text-green-500">
                      <p>client@prosperity.com</p>
                      <p>demo123</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
              <span className="font-medium">Create New Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;