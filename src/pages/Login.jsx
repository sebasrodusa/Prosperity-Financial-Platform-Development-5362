import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestLogin } from '@questlabs/react-sdk';
import questConfig from '../questConfig';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = ({ userId, token, newUser }) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    
    if (newUser) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Section: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-prosperity-navy to-prosperity-blue p-12 flex-col justify-between">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">ProsperityChecker™</h1>
          <p className="text-xl opacity-80">Your complete financial management solution</p>
        </div>
        <div className="text-white opacity-70">
          <p className="text-sm">© 2024 ProsperityChecker. All rights reserved.</p>
        </div>
      </div>

      {/* Right Section: Login Component */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <QuestLogin
            onSubmit={handleLogin}
            email={true}
            google={false}
            accent={questConfig.PRIMARY_COLOR}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;