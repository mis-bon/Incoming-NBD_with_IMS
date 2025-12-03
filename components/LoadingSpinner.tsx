
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-transparent border-t-violet-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-t-fuchsia-500 rounded-full animate-spin" style={{ animationDelay: '0.2s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-4 border-4 border-transparent border-t-teal-400 rounded-full animate-spin" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="mt-6 text-xl text-gray-300 tracking-widest">LOADING DATA...</p>
    </div>
  );
};

export default LoadingSpinner;