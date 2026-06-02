'use client';

import { FileText, Upload, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Props {
  value: 'form' | 'upload' | null;
  onChange: (method: 'form' | 'upload') => void;
}

const methods = [
  {
    id: 'form' as const,
    icon: FileText,
    title: '结构化表单',
    description: '填写学科、年级、课题等结构化信息，AI 自动生成完整课件大纲与内容。适合有明确教学计划的场景。',
    badge: '大多数人的选择',
  },
  {
    id: 'upload' as const,
    icon: Upload,
    title: '上传教案',
    description: '上传已有的 Word 或 TXT 教案文档，AI 自动提取知识点并转化为标准化课件。适合已有教案的教师。',
    badge: undefined,
  },
];

export function MethodSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {methods.map((m) => {
        const isSelected = value === m.id;
        return (
          <Card
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`group relative p-8 cursor-pointer border-2 rounded-2xl transition-all duration-300 hover:shadow-lg ${
              isSelected
                ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/10 shadow-sm'
                : 'border-border/60 bg-card hover:border-brand-200 dark:hover:border-brand-800'
            }`}
          >
            {m.badge && (
              <span className="absolute top-4 right-5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                {m.badge}
              </span>
            )}

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
              isSelected ? 'bg-brand-600 text-white' : 'bg-muted text-muted-foreground group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30'
            }`}>
              <m.icon className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">{m.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>

            <div className={`mt-5 flex items-center gap-1.5 text-sm font-medium transition-colors ${
              isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-muted-foreground/0 group-hover:text-muted-foreground'
            }`}>
              选择此方式
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
