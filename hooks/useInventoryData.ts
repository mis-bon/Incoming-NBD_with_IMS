
import { useState, useEffect, useCallback } from 'react';
import { InventoryItem } from '../types';

const INVENTORY_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby5mwKQ305aQNeSdvUXy4ukBUYFOiYwrdrVAkBF-z9AJHjl-27pk7Q4APARjyAjTBGz/exec';

export const useInventoryData = () => {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(INVENTORY_SCRIPT_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      
      // Handle different possible JSON structures from Apps Script
      // Assuming structure is { data: [{...}, {...}] } or just [{...}]
      const rawData = json.data || json;

      if (!Array.isArray(rawData)) {
        throw new Error("Data format invalid");
      }

      // Map raw data to InventoryItem interface
      const mappedData: InventoryItem[] = rawData.map((item: any) => ({
        tool: item.Tool || item.tool || item['Tool Name'] || 'Unknown Tool',
        brand: item.Brand || item.brand || 'Unknown',
        // Updated to include 'available_stock' which matches your Apps Script
        availableStock: Number(item.available_stock || item['Available Stock'] || item.availableStock || item.Stock || item.stock || 0),
        sold: Number(item.Sold || item.sold || 0)
      }));

      setData(mappedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Failed to fetch Inventory data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Optional: Add polling here if needed, but App.tsx handles view switching which triggers re-mount/fetch
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
