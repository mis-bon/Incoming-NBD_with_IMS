import React from 'react';
import { ReportData } from '../types';
import DataCard from './DataCard';
import PercentageCard from './PercentageCard';
import { LeadIcon, ConnectIcon, InterestIcon, ConvertIcon } from './Icons';

interface ReportSectionProps {
  data: ReportData;
  colorConfig: {
    title: string;
    gradient: string;
  };
  animationDelay: string;
}

const ReportSection: React.FC<ReportSectionProps> = ({ data, colorConfig, animationDelay }) => {
  return (
    <div className="animate-fade-in-up flex flex-col h-full space-y-4" style={{ animationDelay }}>
      <h2 className={`text-2xl lg:text-3xl font-extrabold text-center py-2 rounded-lg bg-gradient-to-r ${colorConfig.gradient} text-white shadow-lg flex-shrink-0`}>
        {colorConfig.title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DataCard title="Total Leads" value={data.totalLeads} icon={<LeadIcon />} colorConfig={colorConfig} />
        <DataCard title="Connected Leads" value={data.connectedLeads} icon={<ConnectIcon />} colorConfig={colorConfig} />
        <DataCard title="Interested Leads" value={data.interestedLeads} icon={<InterestIcon />} colorConfig={colorConfig} />
        <DataCard title="Client Converted" value={data.clientConverted} icon={<ConvertIcon />} colorConfig={colorConfig} />
      </div>
      <div className="flex-grow flex flex-col justify-around space-y-2">
        <PercentageCard title="First Phase Conversion" value={data.firstPhase} colorConfig={colorConfig} />
        <PercentageCard title="Second Phase Conversion" value={data.secondPhase} colorConfig={colorConfig} />
        <PercentageCard title="Third Phase Conversion" value={data.thirdPhase} colorConfig={colorConfig} />
      </div>
    </div>
  );
};

export default ReportSection;