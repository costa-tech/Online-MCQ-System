import { useState, useEffect, useCallback } from 'react';
import { resultService, UserStats } from '../services/resultService';

interface UseUserStatsReturn {
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserStats = (shouldFetch: boolean = true): UseUserStatsReturn => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!shouldFetch) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await resultService.getUserStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch user statistics');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user statistics';
      setError(errorMessage);
      console.error('Error fetching user stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refetch = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch
  };
};
