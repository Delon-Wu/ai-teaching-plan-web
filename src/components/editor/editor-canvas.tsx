'use client';

import { useCallback } from 'react';
import ReactGridLayout, { verticalCompactor } from 'react-grid-layout';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCoursewareStore } from '@/stores/courseware-store';
import { ChartBlock } from './chart-block';
import { FormulaBlock } from './formula-block';
import type { Block } from '@/types';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const BLOCK_STYLES: Record<string, string> = {
  title: 'text-2xl font-bold',
  text: 'text-base',
  question: 'border-l-4 border-brand-500',
};

export function EditorCanvas() {
  const {
    courseware,
    selectedSlideId,
    selectedBlockId,
    selectBlock,
    updateBlock,
    moveBlock,
  } = useCoursewareStore();

  const slide = courseware?.slides.find((s) => s.id === selectedSlideId);

  const handleLayoutChange = useCallback(
    (layout: readonly { i: string; x: number; y: number; w: number; h: number }[]) => {
      if (!selectedSlideId) return;
      layout.forEach((l) => {
        moveBlock(selectedSlideId, l.i, { x: l.x, y: l.y, w: l.w, h: l.h });
      });
    },
    [selectedSlideId, moveBlock]
  );

  if (!slide) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        请选择一个幻灯片
      </div>
    );
  }

  if (slide.blocks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">空白幻灯片</p>
          <p className="text-xs text-muted-foreground">在右侧 AI 工具面板中使用配图功能，或等待 AI 生成内容</p>
        </div>
      </div>
    );
  }

  const layout = slide.blocks.map((b) => ({
    i: b.id,
    x: b.layout.x,
    y: b.layout.y,
    w: b.layout.w,
    h: b.layout.h,
    minW: 1,
    minH: 1,
  }));

  function renderBlock(block: Block) {
    const isSelected = block.id === selectedBlockId;
    const baseClass = `w-full h-full outline-none ${isSelected ? 'ring-2 ring-brand-500 rounded' : ''}`;

    switch (block.type) {
      case 'title':
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(slide!.id, block.id, { content: e.target.value } as Partial<Block>)}
            className={`${baseClass} ${BLOCK_STYLES.title} resize-none border-none bg-transparent`}
            placeholder="标题"
          />
        );
      case 'text':
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(slide!.id, block.id, { content: e.target.value } as Partial<Block>)}
            className={`${baseClass} ${BLOCK_STYLES.text} resize-none border-none bg-transparent`}
            placeholder="文本内容"
          />
        );
      case 'image':
        return block.url ? (
          <img src={block.url} alt={block.alt} className="w-full h-full object-cover rounded" />
        ) : (
          <div className={`${baseClass} flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded text-xs text-muted-foreground`}>
            {block.prompt ? `提示词: ${block.prompt.slice(0, 50)}...` : '图片区域'}
          </div>
        );
      case 'chart':
        return <ChartBlock chartType={block.chartType} data={block.data} />;
      case 'formula':
        return <FormulaBlock latex={block.latex} />;
      case 'question':
        return (
          <div className={`${baseClass} p-3 bg-brand-50/30 dark:bg-brand-950/10 rounded`}>
            <p className="font-medium mb-2">{block.stem}</p>
            {block.options?.map((opt, i) => (
              <p key={i} className="text-sm text-muted-foreground">{String.fromCharCode(65 + i)}. {opt}</p>
            ))}
            {block.answer && <p className="text-xs text-brand-600 mt-1">答案：{block.answer}</p>}
          </div>
        );
      default:
        return <div className={baseClass} />;
    }
  }

  return (
    <div className="flex-1 bg-slate-100 dark:bg-slate-900 p-4 overflow-auto">
      <Card className="max-w-4xl mx-auto aspect-[16/9] bg-white dark:bg-slate-800 shadow-sm relative">
        <ReactGridLayout
          width={960}
          layout={layout}
          gridConfig={{ cols: 12, rowHeight: 30, margin: [4, 4] }}
          dragConfig={{ enabled: true, handle: '.drag-handle' }}
          resizeConfig={{ enabled: true }}
          compactor={verticalCompactor}
          onLayoutChange={handleLayoutChange}
          autoSize
        >
          {slide.blocks.map((block) => (
            <div
              key={block.id}
              onClick={() => selectBlock(block.id)}
              className="overflow-hidden"
            >
              <div className="drag-handle absolute top-0 left-0 right-0 h-5 cursor-move z-10 opacity-0 hover:opacity-100 bg-gradient-to-b from-black/10 to-transparent rounded-t" />
              {renderBlock(block)}
            </div>
          ))}
        </ReactGridLayout>
      </Card>
    </div>
  );
}
