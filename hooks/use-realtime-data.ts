'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

interface UseRealtimeDataOptions {
  endpoint: string;
  interval?: number;
  enabled?: boolean;
}

export function useRealtimeData<T>({ 
  endpoint, 
  interval = 10000, // 10 seconds default
  enabled = true 
}: UseRealtimeDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);
      const response = await apiClient.get<T>(endpoint);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchData();

    // Set up interval for real-time updates
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [fetchData, interval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Specialized hook for dashboard stats
export function useDashboardStats() {
  return useRealtimeData({
    endpoint: '/api/dashboard/stats',
    interval: 5000, // 5 seconds for dashboard
  });
}

// Specialized hook for recent weight records
export function useRecentWeightRecords(limit: number = 5) {
  return useRealtimeData({
    endpoint: `/api/weight-records?limit=${limit}`,
    interval: 10000, // 10 seconds
  });
}

// Specialized hook for notifications
export function useNotifications() {
  return useRealtimeData({
    endpoint: '/api/notifications?unreadOnly=true&limit=5',
    interval: 15000, // 15 seconds
  });
}