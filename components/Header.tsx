import React, { useState, useEffect } from 'react';
import { useDateTime } from '../hooks/useDateTime';

interface HeaderProps {
  view: 'NBD' | 'INVENTORY';
  stats: {
    conversion?: number;
    target?: number;
    totalStock?: number;
    totalSold?: number;
  };
  isLive: boolean;
  onToggleView: () => void;
  nextSwitchTime: number;
  totalDuration: number;
}

const StatCard: React.FC<{
  title: string;
  value: string;
  barPercentage?: number;
  gradient: string;
  borderColor: string;
  shadowColor: string;
}> = ({ title, value, barPercentage, gradient, borderColor, shadowColor }) => {
  return (
    <div 
      className={`
        min-w-max transform -translate-y-1 
        rounded-xl bg-gray-900/50 backdrop-blur-lg border-t-2 ${borderColor} 
        p-2 sm:p-3 shadow-2xl ${shadowColor} animate-fade-in-up
      `}
    >
      <div className="flex justify-between items-baseline mb-1 sm:mb-2 gap-2 sm:gap-4">
        <p className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">{title}</p>
        <p className={`text-lg sm:text-2xl font-bold bg-clip-text text-transparent ${gradient}`}>
          {value}
        </p>
      </div>
      {typeof barPercentage === 'number' && (
        <div className="w-full bg-black/30 rounded-full h-1 sm:h-1.5 overflow-hidden">
          <div 
            className={`h-1 sm:h-1.5 rounded-full ${gradient}`}
            style={{ width: `${Math.min(barPercentage, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ view, stats, isLive, onToggleView, nextSwitchTime, totalDuration }) => {
  const { date, time } = useDateTime();
  const [timeLeft, setTimeLeft] = useState('02:00');
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const updateTimer = () => {
        const now = Date.now();
        const distance = Math.max(0, nextSwitchTime - now);
        
        // Time display
        const minutes = Math.floor(distance / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        
        // Progress circle (1 = full, 0 = empty)
        setProgress(distance / totalDuration);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [nextSwitchTime, totalDuration]);

  const isNBD = view === 'NBD';
  
  // Circle config
  const radius = 22; // Radius of the SVG circle
  const circumference = 2 * Math.PI * radius;

  return (
    <header className="flex items-center w-full gap-2 sm:gap-4 mb-4 flex-nowrap">
      {/* Left: Title & Status */}
      <div className="flex-shrink-0 flex flex-col items-start justify-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold whitespace-nowrap transition-all duration-500">
            {isNBD ? (
              <>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    Incoming-NBD&nbsp;
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-600">
                    INDIA
                </span>
              </>
            ) : (
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-500">
                 Inventory Status
               </span>
            )}
        </h1>
        {isLive && isNBD && (
            <div className="flex items-center gap-1.5 mt-0.5 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-400 tracking-wider shadow-emerald-500/50 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                    REAL-TIME
                </span>
            </div>
        )}
      </div>

      {/* Manual Switch Button & Timer */}
      <div className="flex-shrink-0 ml-1 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center w-[52px] h-[52px]">
            {/* Countdown Circle SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 52 52">
                {/* Background track */}
                <circle 
                    cx="26" cy="26" r={radius} 
                    fill="none" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="3" 
                />
                {/* Progress indicator */}
                <circle 
                    cx="26" cy="26" r={radius} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    className={`${isNBD ? 'text-cyan-400' : 'text-fuchsia-400'} transition-all duration-1000 linear`}
                    strokeDasharray={circumference} 
                    strokeDashoffset={circumference * (1 - progress)}
                />
            </svg>

            <button 
                onClick={onToggleView}
                className="relative z-10 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 active:scale-95 transition-all duration-300 group shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                title="Switch View"
                aria-label="Switch Dashboard View"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            </button>
        </div>
        
        <div className="mt-1 px-1.5 py-0.5 rounded-md bg-black/40 border border-white/5 backdrop-blur-sm min-w-[3rem] flex justify-center">
            <span className="text-[10px] font-mono font-medium text-cyan-200/80 tracking-widest leading-none">
                {timeLeft}
            </span>
        </div>
      </div>

      {/* Center: Stat Cards */}
      <div className="flex-grow flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
            {isNBD ? (
              <>
                <StatCard 
                  title="Overall Conversion"
                  value={`${stats.conversion?.toFixed(2) ?? 0}%`}
                  barPercentage={stats.conversion ?? 0}
                  gradient="bg-gradient-to-r from-green-400 to-teal-500"
                  borderColor="border-green-400"
                  shadowColor="shadow-[0_0_20px_theme(colors.green.500/0.4)]"
                />
                <StatCard 
                  title="Remaining Target"
                  value={stats.target?.toLocaleString() ?? '0'}
                  barPercentage={100} 
                  gradient="bg-gradient-to-r from-amber-400 to-orange-500"
                  borderColor="border-amber-400"
                  shadowColor="shadow-[0_0_20px_theme(colors.amber.500/0.4)]"
                />
              </>
            ) : (
              <>
                <StatCard 
                  title="Total Items"
                  value={stats.totalStock?.toLocaleString() ?? '0'}
                  gradient="bg-gradient-to-r from-violet-400 to-purple-500"
                  borderColor="border-violet-400"
                  shadowColor="shadow-[0_0_20px_theme(colors.violet.500/0.4)]"
                />
                <StatCard 
                  title="Total Sold"
                  value={stats.totalSold?.toLocaleString() ?? '0'}
                  gradient="bg-gradient-to-r from-pink-400 to-rose-500"
                  borderColor="border-pink-400"
                  shadowColor="shadow-[0_0_20px_theme(colors.pink.500/0.4)]"
                />
              </>
            )}
      </div>

      {/* Right: Date & Time */}
      <div className="flex-shrink-0 hidden md:block">
         <div className="text-right p-2 sm:p-3 rounded-xl bg-gray-800/60 backdrop-blur-lg border border-white/10 shadow-lg">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white tracking-wider whitespace-nowrap">{time}</p>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 whitespace-nowrap">{date}</p>
        </div>
      </div>
    </header>
  );
};