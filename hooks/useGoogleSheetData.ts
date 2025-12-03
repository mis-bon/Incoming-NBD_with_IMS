import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '../types';

const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4sIRQIdHtY-GA1kac_aZpJRFzXzfOjbdn83fwMwNIr8SZkdgImgORdULUqGrDJELn/exec';
// REPLACE with your actual WebSocket URL
const WEBSOCKET_URL = 'wss://your-websocket-endpoint.com'; 
const REFRESH_INTERVAL = 300000; // 5 minutes

const calculatePercentages = (total: number, connected: number, interested: number, converted: number): { firstPhase: number, secondPhase: number, thirdPhase: number } => {
    const firstPhase = total > 0 ? (connected / total) * 100 : 0;
    const secondPhase = connected > 0 ? (interested / connected) * 100 : 0;
    const thirdPhase = interested > 0 ? (converted / interested) * 100 : 0;
    return {
        firstPhase: parseFloat(firstPhase.toFixed(2)),
        secondPhase: parseFloat(secondPhase.toFixed(2)),
        thirdPhase: parseFloat(thirdPhase.toFixed(2))
    };
};

export const useGoogleSheetData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [overallConversionRatio, setOverallConversionRatio] = useState<number>(0);
  const [remainingTarget, setRemainingTarget] = useState<number>(0);
  const [isLive, setIsLive] = useState<boolean>(false);

  // Centralized data processing logic for both Fetch and WebSocket sources
  const processSheetData = useCallback((rows: any[]) => {
      if (!rows || !Array.isArray(rows) || rows.length < 14) {
        console.warn("Invalid or incomplete data received");
        return;
      }

      const values = rows.map((row: any) => Number(row.Value) || 0);

      const yesterdayData = {
        totalLeads: values[0],
        connectedLeads: values[1],
        interestedLeads: values[2],
        clientConverted: values[3],
        ...calculatePercentages(values[0], values[1], values[2], values[3])
      };

      const weekData = {
        totalLeads: values[4],
        connectedLeads: values[5],
        interestedLeads: values[6],
        clientConverted: values[7],
        ...calculatePercentages(values[4], values[5], values[6], values[7])
      };

      const monthData = {
        totalLeads: values[8],
        connectedLeads: values[9],
        interestedLeads: values[10],
        clientConverted: values[11],
        ...calculatePercentages(values[8], values[9], values[10], values[11])
      };

      setData({
        yesterday: yesterdayData,
        week: weekData,
        month: monthData,
      });

      setOverallConversionRatio(values[12]);
      setRemainingTarget(values[13]);
      setLoading(false);
  }, []);

  const fetchData = useCallback(async () => {
    // Only show loading state on initial load if data is empty
    if (!data) setLoading(true);
    setError(null);
    try {
      const response = await fetch(GOOGLE_APP_SCRIPT_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const parsedJson = await response.json();
      processSheetData(parsedJson.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Failed to fetch Google Sheet data:", err);
      setLoading(false);
    }
  }, [data, processSheetData]);

  useEffect(() => {
    // 1. Initial HTTP Fetch
    fetchData();
    
    // 2. Setup Polling (Fallback)
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);

    // 3. Setup WebSocket (Real-time)
    let ws: WebSocket | null = null;
    try {
        ws = new WebSocket(WEBSOCKET_URL);

        ws.onopen = () => {
            console.log('WebSocket Connected: Real-time updates enabled');
            setIsLive(true);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                // Expecting structure: { type: 'UPDATE', data: [...] } or just { data: [...] }
                const rows = message.data || message; 
                if (Array.isArray(rows)) {
                    processSheetData(rows);
                }
            } catch (e) {
                console.error('Error parsing WebSocket message', e);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsLive(false);
        };

        ws.onerror = (err) => {
            console.warn('WebSocket Error (Real-time features disabled):', err);
            setIsLive(false);
        };

    } catch (err) {
        console.warn('WebSocket initialization failed:', err);
        setIsLive(false);
    }

    return () => {
        clearInterval(intervalId);
        if (ws) {
            ws.close();
        }
    };
  }, [fetchData, processSheetData]);

  return { data, loading, error, overallConversionRatio, remainingTarget, isLive };
};