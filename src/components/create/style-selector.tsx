'use client';

import { Card } from '@/components/ui/card';
import type { PptStyle } from '@/types';

const styles: { id: PptStyle; title: string; description: string; colors: string[] }[] = [
  { id: 'minimal', title: '简约', description: '干净利落，专注内容本身', colors: ['#faf8f5', '#3d3a35', '#0d7377'] },
  { id: 'business', title: '商务', description: '专业严谨，适合正式场合', colors: ['#1a2332', '#e8e4dd', '#0d7377'] },
  { id: 'fresh', title: '清新', description: '明快活泼，适合低年级', colors: ['#ecfdf3', '#065f3e', '#3fa89a'] },
  { id: 'academic', title: '学术', description: '严谨规范，适合高等教育', colors: ['#fef9ef', '#4a3728', '#8b7355'] },
  { id: 'cartoon', title: '卡通', description: '可爱活泼，适合幼儿教学', colors: ['#fff7f2', '#9a3412', '#c17a52'] },
];

interface Props {
  value: PptStyle;
  onChange: (style: PptStyle) => void;
}

export function StyleSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {styles.map((s) => {
        const isSelected = value === s.id;
        return (
          <Card
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`p-5 cursor-pointer border-2 rounded-xl transition-all duration-300 hover:shadow-md text-center ${
              isSelected
                ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/10'
                : 'border-border/60 bg-card hover:border-brand-200 dark:hover:border-brand-800'
            }`}
          >
            <div className="flex justify-center gap-1.5 mb-4">
              {s.colors.map((c) => (
                <div
                  key={c}
                  className="w-5 h-5 rounded-full ring-1 ring-border/30"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{s.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
