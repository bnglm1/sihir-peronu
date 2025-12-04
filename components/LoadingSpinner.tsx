import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="relative w-16 h-16 animate-spin">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-magic-gold border-t-transparent rounded-full opacity-75"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-magic-purple border-b-transparent rounded-full opacity-50 rotate-45"></div>
      </div>
    </div>
  );
};