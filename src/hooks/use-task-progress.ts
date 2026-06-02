'use client';

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import type { TaskProgress } from '@/types';

export function useTaskProgress(taskId: string | null) {
  return useQuery<TaskProgress>({
    queryKey: ['task', taskId],
    queryFn: () => apiRequest(`/tasks/${taskId}`),
    enabled: !!taskId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'completed' || data?.status === 'failed') return false;
      return 2000;
    },
    refetchIntervalInBackground: false,
  });
}
