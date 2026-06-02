'use client';

import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, FileText, Brain, Image, Puzzle, XCircle } from 'lucide-react';
import type { TaskProgress } from '@/types';

const steps = [
  { key: 'outline', label: '生成大纲', icon: FileText },
  { key: 'content', label: '生成内容', icon: Brain },
  { key: 'images', label: '生成配图', icon: Image },
  { key: 'exercises', label: '生成练习', icon: Puzzle },
];

interface Props {
  task: TaskProgress | undefined;
  isLoading: boolean;
}

export function ProgressTracker({ task, isLoading }: Props) {
  const progress = task?.progress || 0;
  const status = task?.status || 'pending';

  return (
    <div className="max-w-sm mx-auto py-10 text-center space-y-10">
      {/* Status icon */}
      <div className="flex justify-center">
        {status === 'pending' || status === 'processing' ? (
          <div className="w-20 h-20 rounded-3xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-brand-600 dark:text-brand-400 animate-spin" />
          </div>
        ) : status === 'completed' ? (
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-destructive/70" />
          </div>
        )}
      </div>

      {/* Text */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          {status === 'pending' && '准备中…'}
          {status === 'processing' && 'AI 正在为你生成课件'}
          {status === 'completed' && '课件生成完成'}
          {status === 'failed' && '生成失败'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5">
          {status === 'processing' && (task?.currentStep || '处理中…')}
          {status === 'failed' && (task?.error || '请稍后重试')}
          {status === 'completed' && '即将跳转到编辑器'}
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-1.5 rounded-full" />
        <p className="text-xs text-muted-foreground/60 tabular-nums">{progress}%</p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-4 gap-3">
        {steps.map((s, i) => {
          const done = progress >= ((i + 1) / steps.length) * 100;
          const active = task?.currentStep?.includes(s.key);
          return (
            <div
              key={s.key}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center transition-colors ${
                done
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : active
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-muted-foreground/40'
              }`}
            >
              <s.icon className="h-5 w-5" />
              <span className="text-[10px] leading-tight font-medium">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
