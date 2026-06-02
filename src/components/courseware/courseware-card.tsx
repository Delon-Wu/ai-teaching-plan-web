'use client';

import Link from 'next/link';
import { Eye, Pencil, MoreHorizontal, Trash2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CoursewareListItem } from '@/types';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  draft: { label: '草稿', variant: 'secondary' },
  generating: { label: '生成中', variant: 'outline' },
  completed: { label: '已完成', variant: 'default' },
};

const styleGradients: Record<string, string> = {
  minimal: 'from-brand-50 to-brand-100 dark:from-brand-950 dark:to-brand-900',
  business: 'from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800',
  cartoon: 'from-[var(--copper-50)] to-[var(--copper-100)] dark:from-[var(--copper-950)] dark:to-[var(--copper-900)]',
  academic: 'from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900',
  fresh: 'from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
};

interface Props {
  courseware: CoursewareListItem;
  onDelete?: (id: string) => void;
}

export function CoursewareCard({ courseware, onDelete }: Props) {
  const status = statusLabels[courseware.status] || statusLabels.draft;
  const gradient = styleGradients[courseware.style] || styleGradients.minimal;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border/60 bg-card hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-md transition-all duration-300">
      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-2 border-current opacity-20" />
          <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full border-2 border-current opacity-15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-1 bg-current opacity-20 rounded-full" />
        </div>

        <div className="relative text-center p-6">
          <p className="text-lg font-bold text-foreground/80 line-clamp-2">{courseware.title}</p>
          <p className="text-xs text-muted-foreground mt-1.5">
            {courseware.subject} · {courseware.grade}
          </p>
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <Link href={`/editor/${courseware.id}?preview=1`}>
            <Button size="sm" variant="secondary" className="rounded-lg pressable">
              <Eye className="h-4 w-4 mr-1.5" />
              预览
            </Button>
          </Link>
          <Link href={`/editor/${courseware.id}`}>
            <Button size="sm" className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white pressable">
              <Pencil className="h-4 w-4 mr-1.5" />
              编辑
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-sm truncate">{courseware.title}</h3>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{new Date(courseware.updatedAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant={status.variant} className="text-[10px] font-normal rounded-md">
              {status.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" />}
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <Link href={`/editor/${courseware.id}`}>
                  <DropdownMenuItem>
                    <Pencil className="h-4 w-4 mr-2" />
                    编辑
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete?.(courseware.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
