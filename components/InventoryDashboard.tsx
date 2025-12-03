import React from 'react';
import { InventoryItem } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface InventoryDashboardProps {
  data: InventoryItem[];
  loading: boolean;
  error: string | null;
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ data, loading, error }) => {
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div className="bg-red-900/50 border border-red-500 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Error Fetching Inventory</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  // Theme styling constants for Inventory View (Purple/Fuchsia)
  const containerBorder = "border-fuchsia-600";
  const containerShadow = "shadow-[0_0_25px_rgba(216,180,254,0.15)]";
  const headerBg = "bg-fuchsia-700"; 
  const cellBorder = "border-fuchsia-600";
  const headerText = "text-white";
  const rowHover = "hover:bg-fuchsia-500/20";
  const textHighlight = "group-hover:text-fuchsia-200";
  
  // Reduced padding for row height
  const cellPadding = "p-2";

  return (
    <div className="w-full h-full flex flex-col animate-fade-in-up">
      <div className={`flex-grow overflow-hidden rounded-xl bg-gray-900/40 backdrop-blur-md border-2 ${containerBorder} ${containerShadow}`}>
        <div className="overflow-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead className={`sticky top-0 z-10 ${headerBg} backdrop-blur-xl`}>
              <tr>
                <th className={`${cellPadding} text-sm font-bold tracking-wider ${headerText} uppercase border ${cellBorder}`}>Tool Name</th>
                <th className={`${cellPadding} text-sm font-bold tracking-wider ${headerText} uppercase border ${cellBorder}`}>Brand</th>
                <th className={`${cellPadding} text-sm font-bold tracking-wider text-right ${headerText} uppercase border ${cellBorder}`}>Available Stock</th>
                <th className={`${cellPadding} text-sm font-bold tracking-wider text-right ${headerText} uppercase border ${cellBorder}`}>Sold</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {data.map((item, index) => (
                <tr 
                  key={`${item.tool}-${index}`}
                  className={`${rowHover} transition-colors duration-200 group`}
                >
                  <td className={`${cellPadding} font-medium text-white ${textHighlight} transition-colors border ${cellBorder}`}>
                    {item.tool}
                  </td>
                  <td className={`${cellPadding} text-gray-400 border ${cellBorder}`}>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-800 text-gray-300 border border-gray-600">
                      {item.brand}
                    </span>
                  </td>
                  <td className={`${cellPadding} text-right border ${cellBorder}`}>
                    <span className={`
                      font-bold text-base
                      ${item.availableStock > 50 ? 'text-emerald-400' : item.availableStock > 20 ? 'text-amber-400' : 'text-rose-400'}
                    `}>
                      {item.availableStock}
                    </span>
                  </td>
                  <td className={`${cellPadding} text-right border ${cellBorder} text-white font-bold`}>
                    {item.sold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;