import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import Dashboard from './components/Dashboard';
import InventoryDashboard from './components/InventoryDashboard';
import { AnimatedBackground } from './components/AnimatedBackground';
import { useGoogleSheetData } from './hooks/useGoogleSheetData';
import { useInventoryData } from './hooks/useInventoryData';

type ViewType = 'NBD' | 'INVENTORY';

// 2 minutes in milliseconds
const SWITCH_INTERVAL = 120000; 

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('NBD');
  const [nextSwitchTime, setNextSwitchTime] = useState<number>(Date.now() + SWITCH_INTERVAL);

  // NBD Data Hook
  const { 
    data: nbdData, 
    loading: nbdLoading, 
    error: nbdError, 
    overallConversionRatio, 
    remainingTarget, 
    isLive 
  } = useGoogleSheetData();

  // Inventory Data Hook
  const { 
    data: inventoryData, 
    loading: invLoading, 
    error: invError 
  } = useInventoryData();

  // Calculate generic inventory stats for header
  const totalStock = inventoryData?.reduce((acc, item) => acc + item.availableStock, 0) || 0;
  const totalSold = inventoryData?.reduce((acc, item) => acc + item.sold, 0) || 0;

  // Handler for manual toggle
  const toggleView = () => {
    setCurrentView(prev => prev === 'NBD' ? 'INVENTORY' : 'NBD');
  };

  useEffect(() => {
    // Reset the target time whenever the view changes
    setNextSwitchTime(Date.now() + SWITCH_INTERVAL);

    const timer = setInterval(() => {
      setCurrentView(prev => prev === 'NBD' ? 'INVENTORY' : 'NBD');
    }, SWITCH_INTERVAL);

    return () => clearInterval(timer);
  }, [currentView]); // Depend on currentView to reset timer on manual switch

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900 text-white flex flex-col">
      {/* Animated Gradient Background */}
      <div className="animated-gradient fixed inset-0 z-[-2]"></div>
      
      {/* Animated Shapes Background - change color slightly based on view */}
      <AnimatedBackground shapeColor={currentView === 'INVENTORY' ? 'rgba(216, 180, 254, 0.08)' : undefined} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col flex-grow overflow-hidden">
        <Header 
          view={currentView}
          stats={{
            conversion: overallConversionRatio,
            target: remainingTarget,
            totalStock: totalStock,
            totalSold: totalSold
          }}
          isLive={isLive}
          onToggleView={toggleView}
          nextSwitchTime={nextSwitchTime}
          totalDuration={SWITCH_INTERVAL}
        />
        
        {/* Conditional Rendering of Dashboard Views */}
        <div className="flex-grow overflow-hidden relative">
          {currentView === 'NBD' ? (
            <Dashboard data={nbdData} loading={nbdLoading && !nbdData} error={nbdError} />
          ) : (
            <InventoryDashboard data={inventoryData} loading={invLoading && inventoryData.length === 0} error={invError} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;