import React from 'react';
import ReportSection from './ReportSection';
import LoadingSpinner from './LoadingSpinner';
import { DashboardData } from '../types';

const colorConfigs = {
  yesterday: {
    title: "Yesterday's Report",
    gradient: 'from-violet-500 to-purple-600',
  },
  week: {
    title: "This Week's Report",
    gradient: 'from-fuchsia-500 to-pink-600',
  },
  month: {
    title: "This Month's Report",
    gradient: 'from-teal-400 to-cyan-500',
  },
};

interface DashboardProps {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ data, loading, error }) => {

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div className="bg-red-900/50 border border-red-500 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Error Fetching Data</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 flex-grow">
      <ReportSection 
        data={data.yesterday} 
        colorConfig={colorConfigs.yesterday} 
        animationDelay="0s" 
      />
      <ReportSection 
        data={data.week} 
        colorConfig={colorConfigs.week} 
        animationDelay="0.2s" 
      />
      <ReportSection 
        data={data.month} 
        colorConfig={colorConfigs.month} 
        animationDelay="0.4s" 
      />
    </div>
  );
};

export default Dashboard;
