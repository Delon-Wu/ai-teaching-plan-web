'use client';

import { Expand, RefreshCw, Lightbulb, ImageIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AiToolButton } from './ai-tool-button';
import { useEditorStore } from '@/stores/editor-store';
import { useCoursewareStore } from '@/stores/courseware-store';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';
import { Disclaimer } from '@/components/common/disclaimer';

const tools = [
  { id: 'expand' as const, label: '展开讲解', desc: '将大纲扩展为 200 字讲课稿', icon: Expand },
  { id: 'rephrase' as const, label: '换个说法', desc: '使语言更生动或更正式', icon: RefreshCw },
  { id: 'analogy' as const, label: '生成类比', desc: '生成生活类比帮助理解', icon: Lightbulb },
  { id: 'image-prompt' as const, label: '自动配图', desc: '生成配图提示词并出图', icon: ImageIcon },
];

export function SidebarTools() {
  const { isSidebarOpen, toggleSidebar, aiToolLoading, setAiToolLoading } = useEditorStore();
  const { courseware, selectedSlideId, selectedBlockId, updateBlock } = useCoursewareStore();

  if (!isSidebarOpen) {
    return (
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-l-xl rounded-r-none shadow-md border-border/60 bg-card/90 backdrop-blur"
          onClick={toggleSidebar}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const selectedBlock = courseware?.slides
    .find((s) => s.id === selectedSlideId)
    ?.blocks.find((b) => b.id === selectedBlockId);

  const hasTextSelected = selectedBlock && (selectedBlock.type === 'text' || selectedBlock.type === 'title');

  async function handleAiAction(tool: 'expand' | 'rephrase' | 'analogy' | 'image-prompt') {
    if (!selectedSlideId || !selectedBlockId) {
      toast.info('请先选中一个文本块');
      return;
    }
    if (!hasTextSelected && tool !== 'image-prompt') {
      toast.info('该功能仅适用于文本块');
      return;
    }

    setAiToolLoading(tool);

    try {
      const content = selectedBlock && ('content' in selectedBlock ? selectedBlock.content : '')
        || selectedBlock && ('stem' in selectedBlock ? selectedBlock.stem : '');

      const result = await apiRequest<{ output: string }>('/ai/' + tool.replace('-', '_'), {
        method: 'POST',
        body: { content: content || '', slideId: selectedSlideId, blockId: selectedBlockId },
      });

      if (tool === 'image-prompt') {
        const { addBlock } = useCoursewareStore.getState();
        addBlock(selectedSlideId, {
          id: crypto.randomUUID(),
          type: 'image',
          url: '',
          prompt: result.output,
          alt: result.output,
          layout: { x: 0, y: 0, w: 6, h: 4 },
        });
        toast.success('配图提示词已生成');
      } else {
        updateBlock(selectedSlideId, selectedBlockId, {
          content: result.output,
        } as Partial<{ content: string }>);
        const label = tool === 'expand' ? '内容已展开' : tool === 'rephrase' ? '说法已更新' : '类比已生成';
        toast.success(label);
      }
    } catch {
      toast.error('AI 操作失败，请重试');
    } finally {
      setAiToolLoading(null);
    }
  }

  return (
    <div className="w-60 border-l border-border/40 bg-card flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/40">
        <span className="text-sm font-medium">AI 工具</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={toggleSidebar}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-0.5">
          <p className="text-[11px] text-muted-foreground/70 px-2 mb-2 mt-1">选中文本块后可用：</p>
          {tools.map((t) => (
            <AiToolButton
              key={t.id}
              label={t.label}
              description={t.desc}
              icon={t.icon}
              loading={aiToolLoading === t.id}
              onClick={() => handleAiAction(t.id)}
            />
          ))}
        </div>
      </ScrollArea>

      <Disclaimer />
    </div>
  );
}
