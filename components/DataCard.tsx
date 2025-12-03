import React from 'react';

interface DataCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorConfig: {
    gradient: string;
  };
}

const DataCard: React.FC<DataCardProps> = ({ title, value, icon, colorConfig }) => {
  return (
    <div 
      className={`
        relative p-[2px] rounded-2xl bg-gradient-to-br ${colorConfig.gradient} 
        transition-all duration-300 ease-in-out hover:-translate-y-1 group
      `}
    >
      <div className={`
        absolute -inset-1 bg-gradient-to-br ${colorConfig.gradient} 
        rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300
      `}></div>
      <div className="relative h-full w-full bg-gray-900/80 backdrop-blur-lg rounded-[14px] p-4 text-center flex flex-col items-center justify-center">
        <div className="text-3xl mb-2 text-white/90">{icon}</div>
        <p className="text-base font-semibold text-gray-300">{title}</p>
        <p className="text-4xl font-bold text-white tracking-tighter">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default DataCard;