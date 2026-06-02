import { FileText, Sparkles, Palette, Download } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: '智能生成',
    description: '输入课题与知识点，AI 自动构建完整课件大纲与内容，支持 5 种教学风格切换。',
    stat: '5 种风格',
  },
  {
    icon: FileText,
    title: '教案解析',
    description: '上传 Word 或 TXT 文档，自动提取关键知识点并转化为标准化课件结构。',
    stat: '秒级解析',
  },
  {
    icon: Palette,
    title: '自动配图',
    description: '根据每页内容智能生成配图提示词，让抽象概念变得直观可视。',
    stat: '千图即出',
  },
  {
    icon: Download,
    title: '一键导出',
    description: '支持 PPTX 格式导出，保留图表、公式等所有元素，兼容 PowerPoint 和 WPS。',
    stat: '完整还原',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header — left aligned, not centered */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 font-medium">
            核心能力
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
            比传统备课快 10 倍
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            不是替代教师，而是把教师从重复劳动中解放出来，专注于更有创造性的教学设计。
          </p>
        </div>

        {/* Asymmetric grid: 2 + 2 staggered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative p-8 rounded-2xl border border-border/60 bg-card hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300 ${
                i % 2 === 1 ? 'md:mt-12' : '' // staggered layout
              }`}
            >
              {/* Number */}
              <span className="absolute top-6 right-8 text-5xl font-bold text-brand-100 dark:text-brand-900/30 tabular-nums select-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>

                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {f.description}
                </p>

                <span className="inline-block text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-full">
                  {f.stat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
