'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface Props {
  slideCount: number;
  onSlideCountChange: (n: number) => void;
  requirements: string;
  onRequirementsChange: (s: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export function ParamSelector({
  slideCount,
  onSlideCountChange,
  requirements,
  onRequirementsChange,
  onBack,
  onSubmit,
  loading,
}: Props) {
  return (
    <div className="space-y-7">
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <Label className="text-sm font-medium">课件页数</Label>
          <span className="text-2xl font-bold tabular-nums text-brand-600 dark:text-brand-400">
            {slideCount}
            <span className="text-sm font-normal text-muted-foreground ml-1">页</span>
          </span>
        </div>
        <Slider
          value={[slideCount]}
          onValueChange={(v) => onSlideCountChange(Array.isArray(v) ? v[0] : v)}
          min={3}
          max={30}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground/60 mt-1.5">
          <span>3</span>
          <span>30</span>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2.5 block">额外要求</Label>
        <Textarea
          placeholder="例如：多加入生活类比、语言幽默一些、加入互动提问环节..."
          value={requirements}
          onChange={(e) => onRequirementsChange(e.target.value)}
          className="min-h-[100px] rounded-xl border-border/80 bg-white/80 dark:bg-card/80 resize-none"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground/60 mt-1.5">{requirements.length} / 1000</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="rounded-xl h-11">
          上一步
        </Button>
        <Button
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 rounded-xl h-11 bg-brand-600 hover:bg-brand-700 text-white font-medium pressable"
        >
          {loading ? '正在创建任务…' : '开始生成课件'}
        </Button>
      </div>
    </div>
  );
}
