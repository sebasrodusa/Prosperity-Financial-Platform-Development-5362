import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnBoarding } from '@questlabs/react-sdk';
import questConfig from '../questConfig';

const Onboarding = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const getAnswers = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Section: Progress Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-prosperity-navy to-prosperity-blue p-12 flex-col justify-between">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
          <p className="text-xl opacity-80">Let's set up your account preferences</p>
        </div>
        <div className="text-white opacity-70">
          <p className="text-sm">© 2024 ProsperityChecker. All rights reserved.</p>
        </div>
      </div>

      {/* Right Section: Onboarding Component */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <OnBoarding
            userId={userId}
            token={token}
            questId={questConfig.QUEST_ONBOARDING_QUESTID}
            answer={answers}
            setAnswer={setAnswers}
            getAnswers={getAnswers}
            accent={questConfig.PRIMARY_COLOR}
            singleChoose="modal1"
            multiChoice="modal2"
          >
            <OnBoarding.Header />
            <OnBoarding.Content />
            <OnBoarding.Footer />
          </OnBoarding>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;