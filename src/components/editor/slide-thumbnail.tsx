'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCoursewareStore } from '@/stores/courseware-store';

export function SlideThumbnailStrip() {
  const { courseware, selectedSlideId, selectSlide, addSlide, deleteSlide } = useCoursewareStore();

  if (!courseware) return null;

  return (
    <div className="w-44 border-r border-border/40 bg-card/50 flex flex-col shrink-0">
      <div className="px-3 py-2.5 border-b border-border/40 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {courseware.slides.length} 页幻灯片
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/30"
          onClick={() => addSlide()}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {courseware.slides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => selectSlide(slide.id)}
              className={`group relative flex items-center gap-1.5 p-2 rounded-xl cursor-pointer border transition-all ${
                selectedSlideId === slide.id
                  ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/20 shadow-sm'
                  : 'border-transparent hover:border-border/60 hover:bg-muted/50'
              }`}
            >
              <GripVertical className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
              <div className="flex-1 min-w-0">
                <div className="w-full aspect-[16/10] rounded-lg bg-muted/50 border border-border/40 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-muted-foreground/60 tabular-nums">
                    {index + 1}
                  </span>
                </div>
              </div>
              {courseware.slides.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 absolute -top-1.5 -right-1.5 rounded-full bg-background border border-border/60 shadow-sm hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(slide.id);
                  }}
                >
                  <Trash2 className="h-2.5 w-2.5 text-destructive/70" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
