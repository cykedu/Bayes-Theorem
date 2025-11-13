import React from 'react';
import { type BallColor } from '../types';

interface BallProps {
  color: BallColor;
  highlight?: boolean;
  dim?: boolean;
}

const BallComponent: React.FC<BallProps> = ({ color, highlight = false, dim = false }) => {
  const colorClasses = {
    red: 'bg-red-500 shadow-red-500/50',
    blue: 'bg-blue-500 shadow-blue-500/50',
  };

  const baseClasses = `w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 ease-in-out`;
  
  const stateClasses = highlight 
    ? 'scale-110 ring-4 ring-yellow-400 dark:ring-yellow-300 ring-offset-2 dark:ring-offset-slate-800' 
    : dim 
    ? 'opacity-30' 
    : '';

  return (
    <div
      className={`${baseClasses} ${colorClasses[color]} ${stateClasses}`}
    >
    </div>
  );
};

export default BallComponent;
