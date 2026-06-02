'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import type { CoursewareListItem, Courseware } from '@/types';

export function useCoursewares() {
  return useQuery<CoursewareListItem[]>({
    queryKey: ['coursewares'],
    queryFn: () => apiRequest('/coursewares'),
  });
}

export function useCourseware(id: string | undefined) {
  return useQuery<Courseware>({
    queryKey: ['courseware', id],
    queryFn: () => apiRequest(`/coursewares/${id}`),
    enabled: !!id,
  });
}

export function useCreateCourseware() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Courseware>) =>
      apiRequest<Courseware>('/coursewares', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coursewares'] });
    },
  });
}

export function useUpdateCourseware() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Courseware> }) =>
      apiRequest<Courseware>(`/coursewares/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coursewares'] });
      queryClient.invalidateQueries({ queryKey: ['courseware', variables.id] });
    },
  });
}

export function useDeleteCourseware() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/coursewares/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coursewares'] });
    },
  });
}
