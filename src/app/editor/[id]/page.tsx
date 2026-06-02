'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader2, Play, Save, Undo, Redo, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SlideThumbnailStrip } from '@/components/editor/slide-thumbnail';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { SidebarTools } from '@/components/editor/sidebar-tools';
import { PreviewModal } from '@/components/editor/preview-modal';
import { FeedbackModal } from '@/components/common/feedback-modal';
import { useEditorStore } from '@/stores/editor-store';
import { useCoursewareStore } from '@/stores/courseware-store';
import { useCourseware, useUpdateCourseware } from '@/hooks/use-coursewares';
import { toast } from 'sonner';

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isPreview = searchParams.get('preview') === '1';

  const { data: loadedCourseware, isLoading } = useCourseware(id);
  const updateMutation = useUpdateCourseware();

  const {
    courseware,
    setCourseware,
    newCourseware,
    isDirty,
    undo,
    redo,
    historyIndex,
    history,
  } = useCoursewareStore();

  const { togglePreview } = useEditorStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isLoading || initialized) return;
    if (loadedCourseware) {
      setCourseware(loadedCourseware);
    } else if (id === 'new') {
      newCourseware();
    }
    setInitialized(true);
  }, [isLoading, initialized, loadedCourseware, id, setCourseware, newCourseware]);

  useEffect(() => {
    if (isPreview) togglePreview();
  }, [isPreview, togglePreview]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [courseware]);

  async function handleSave() {
    if (!courseware) return;
    try {
      await updateMutation.mutateAsync({ id: courseware.id, data: courseware });
      useCoursewareStore.getState().markClean();
      toast.success('课件已保存');
    } catch {
      toast.error('保存失败，请重试');
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto" />
          <p className="text-sm text-muted-foreground">加载课件中…</p>
        </div>
      </div>
    );
  }

  if (!courseware && initialized) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-5xl mb-2">📄</div>
          <p className="text-muted-foreground">课件不存在或已被删除</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-card/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold truncate max-w-[300px]">
            {courseware?.title || '未命名课件'}
          </h1>
          {isDirty && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
              未保存
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="撤销 (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="重做 (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-lg border-border/60 bg-card pressable"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            <Save className="h-3.5 w-3.5" />
            保存
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white pressable"
            onClick={togglePreview}
          >
            <Play className="h-3.5 w-3.5" />
            预览
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden relative">
        <SlideThumbnailStrip />
        <EditorCanvas />
        <SidebarTools />
      </div>

      <PreviewModal />
      <FeedbackModal />
    </div>
  );
}
