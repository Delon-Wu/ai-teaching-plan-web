'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { MethodSelector } from '@/components/create/method-selector';
import { StructuredForm } from '@/components/create/structured-form';
import { UploadForm } from '@/components/create/upload-form';
import { StyleSelector } from '@/components/create/style-selector';
import { ParamSelector } from '@/components/create/param-selector';
import { ProgressTracker } from '@/components/create/progress-tracker';
import { useTaskProgress } from '@/hooks/use-task-progress';
import { apiRequest } from '@/lib/api';
import { InviteGuard } from '@/components/common/invite-guard';
import type { PptStyle, CreatePptFormData } from '@/types';

type Step = 'method' | 'content' | 'style' | 'progress';

const stepLabels: Record<Step, string> = {
  method: '选择创建方式',
  content: '填写内容',
  style: '选择风格与参数',
  progress: '生成中',
};

const stepOrder: Step[] = ['method', 'content', 'style', 'progress'];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<'form' | 'upload' | null>(null);
  const [formData, setFormData] = useState<CreatePptFormData | null>(null);
  const [uploadOutline, setUploadOutline] = useState('');
  const [style, setStyle] = useState<PptStyle>('minimal');
  const [slideCount, setSlideCount] = useState(10);
  const [requirements, setRequirements] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: task } = useTaskProgress(taskId);

  // Auto-navigate to editor when task completes
  if (task?.status === 'completed' && task.result?.id) {
    setTimeout(() => router.push(`/editor/${task.result!.id}`), 1500);
  }

  const handleFormSubmit = useCallback((data: CreatePptFormData) => {
    setFormData(data);
    setStep('style');
  }, []);

  const handleUploadOutline = useCallback((outline: string) => {
    setUploadOutline(outline);
    setStep('style');
  }, []);

  const handleStartGeneration = useCallback(async () => {
    setCreating(true);
    try {
      const body: Record<string, unknown> = {
        method,
        style,
        slideCount,
        requirements,
      };
      if (method === 'form') {
        body.formData = formData;
      } else {
        body.outline = uploadOutline;
      }

      const result = await apiRequest<{ taskId: string }>('/generate/ppt', {
        method: 'POST',
        body,
      });
      setTaskId(result.taskId);
      setStep('progress');
    } catch {
      toast.error('创建任务失败，请重试');
    } finally {
      setCreating(false);
    }
  }, [method, style, slideCount, requirements, formData, uploadOutline]);

  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <InviteGuard>
      <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {stepOrder.slice(0, -1).map((s, i) => {
          const active = currentStepIndex >= i;
          const isCurrent = step === s;
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground'
                } ${isCurrent ? 'ring-2 ring-brand-300 ring-offset-2' : ''}`}
              >
                {i + 1}
              </div>
              <span className={`text-sm ${isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                {stepLabels[s]}
              </span>
              {i < stepOrder.length - 2 && <Separator className="w-8" />}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 'method' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">选择创建方式</h2>
            <MethodSelector value={method} onChange={(m) => { setMethod(m); setStep('content'); }} />
          </div>
        )}

        {step === 'content' && method === 'form' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">填写课件信息</h2>
            <StructuredForm onSubmit={handleFormSubmit} onBack={() => setStep('method')} />
          </div>
        )}

        {step === 'content' && method === 'upload' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">上传教案文档</h2>
            <UploadForm onOutlineReady={handleUploadOutline} onBack={() => setStep('method')} />
          </div>
        )}

        {step === 'style' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">选择课件风格</h2>
              <StyleSelector value={style} onChange={setStyle} />
            </div>
            <Separator />
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">生成参数</h2>
              <ParamSelector
                slideCount={slideCount}
                onSlideCountChange={setSlideCount}
                requirements={requirements}
                onRequirementsChange={setRequirements}
                onBack={() => setStep('content')}
                onSubmit={handleStartGeneration}
                loading={creating}
              />
            </div>
          </div>
        )}

        {step === 'progress' && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center mb-6">课件生成中</h2>
            <ProgressTracker task={task} isLoading={!task} />
            {task?.status === 'completed' && (
              <div className="text-center mt-8">
                <Button
                  className="bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={() => router.push(`/editor/${task.result!.id}`)}
                >
                  进入编辑器
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </InviteGuard>
  );
}
