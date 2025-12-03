import React from 'react';

interface PercentageCardProps {
  title: string;
  value: number;
  colorConfig: {
    gradient: string;
  };
}

const PercentageCard: React.FC<PercentageCardProps> = ({ title, value, colorConfig }) => {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-white/10 rounded-lg p-3 transition-all duration-300 hover:border-white/20 hover:bg-gray-800/80">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm text-gray-300">{title}</p>
        <p className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorConfig.gradient}`}>
          {value.toFixed(2)}%
        </p>
      </div>
      <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
        <div 
          className={`bg-gradient-to-r ${colorConfig.gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PercentageCard;