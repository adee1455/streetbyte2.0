import React from 'react';

const DesktopWarning = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-gray-100 z-50 flex items-center justify-center p-4 md:block hidden">
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Mobile Only Experience</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              This application is designed exclusively for mobile devices. Please open this website on your smartphone or tablet for the best experience.
            </p>
          </div>

          <div className="w-full pt-4">
            <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopWarning; 