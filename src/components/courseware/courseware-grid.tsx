'use client';

import { FilePlus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCoursewares, useDeleteCourseware } from '@/hooks/use-coursewares';
import { CoursewareCard } from './courseware-card';
import { toast } from 'sonner';

export function CoursewareGrid() {
  const { data: coursewares, isLoading, error } = useCoursewares();
  const deleteMutation = useDeleteCourseware();

  function handleDelete(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('课件已删除'),
      onError: () => toast.error('删除失败，请重试'),
    });
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-border/40">
            <div className="h-44 skeleton-shimmer" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-2/3 rounded skeleton-shimmer" />
              <div className="h-3 w-1/3 rounded skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !coursewares) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-7 w-7 text-destructive/60" />
        </div>
        <p className="text-muted-foreground">加载失败，请刷新页面重试</p>
      </div>
    );
  }

  if (coursewares.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-7xl mb-6">📝</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">还没有课件</h3>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto leading-relaxed">
          创建你的第一份 AI 课件，体验从大纲到完整 PPT 的智能生成
        </p>
        <Link href="/create">
          <Button className="gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white pressable">
            <FilePlus className="h-4 w-4" />
            开始创建
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {coursewares.map((cw) => (
        <CoursewareCard key={cw.id} courseware={cw} onDelete={handleDelete} />
      ))}
    </div>
  );
}
