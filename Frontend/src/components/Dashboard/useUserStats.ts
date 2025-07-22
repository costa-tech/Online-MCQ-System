import { useState, useEffect } from 'react';

interface UserStats {
  totalExams: number;
  averageScore: number;
  totalTimeSpent: number;
  availableExams: number;
  passRate: number;
  totalMarks: number;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    totalExams: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    availableExams: 0,
    passRate: 0,
    totalMarks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        // Fetch user statistics
        const userStatsResponse = await fetch('http://localhost:5000/api/results/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!userStatsResponse.ok) {
          throw new Error('Failed to fetch user statistics');
        }

        const userStatsData = await userStatsResponse.json();

        // Fetch available exams count
        const examsController = new AbortController();
        const examsTimeoutId = setTimeout(() => examsController.abort(), 5000);

        const examsResponse = await fetch('http://localhost:5000/api/exams', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: examsController.signal
        });

        clearTimeout(examsTimeoutId);

        if (!examsResponse.ok) {
          throw new Error('Failed to fetch available exams');
        }

        const examsData = await examsResponse.json();
        
        setStats({
          totalExams: userStatsData.data.overall.totalExams || 0,
          averageScore: Math.round(userStatsData.data.overall.averagePercentage || 0),
          totalTimeSpent: userStatsData.data.overall.totalTimeTaken || 0,
          availableExams: examsData.data.length || 0,
          passRate: userStatsData.data.overall.passRate || 0,
          totalMarks: userStatsData.data.overall.totalScore || 0
        });
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timed out - server may be unavailable');
        }
        throw fetchError;
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Set default stats instead of keeping loading state
      setStats({
        totalExams: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        availableExams: 0,
        passRate: 0,
        totalMarks: 0
      });
      setError(err instanceof Error ? err.message : 'Failed to fetch user statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
