import type { Metadata } from 'next';
import { apiRequest } from '@/lib/api';
import type { Courseware } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const courseware = await apiRequest<Courseware>(`/coursewares/${id}`);
    return {
      title: `${courseware.title} - 课研智造`,
      description: `${courseware.subject} · ${courseware.grade} | ${courseware.slides.length} 页课件`,
      openGraph: {
        title: courseware.title,
        description: `课研智造 AI 生成的 ${courseware.subject} 课件`,
        type: 'article',
      },
    };
  } catch {
    return {
      title: '课件分享 - 课研智造',
      description: '查看 AI 生成的课件',
    };
  }
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;

  let courseware: Courseware | null = null;
  let error = false;

  try {
    courseware = await apiRequest<Courseware>(`/coursewares/${id}`);
  } catch {
    error = true;
  }

  if (error || !courseware) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">课件不存在</h1>
          <p className="text-muted-foreground">该课件可能已被删除或设为私密</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{courseware.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {courseware.subject} · {courseware.grade} · {courseware.slides.length} 页
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          由 课研智造 AI 生成
        </p>
      </div>

      {/* Slides */}
      <div className="space-y-6">
        {courseware.slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 aspect-[16/10] relative"
          >
            <span className="absolute top-3 left-3 text-xs text-muted-foreground">
              {index + 1}/{courseware.slides.length}
            </span>
            <div className="space-y-4 mt-4">
              {slide.blocks.map((block) => {
                switch (block.type) {
                  case 'title':
                    return <h2 key={block.id} className="text-2xl font-bold">{block.content}</h2>;
                  case 'text':
                    return <p key={block.id} className="text-base leading-relaxed">{block.content}</p>;
                  case 'image':
                    return block.url ? (
                      <img key={block.id} src={block.url} alt={block.alt} className="max-h-64 rounded" />
                    ) : null;
                  case 'question':
                    return (
                      <div key={block.id} className="p-4 bg-brand-50 dark:bg-brand-950/20 rounded-lg border-l-4 border-brand-500">
                        <p className="font-medium">{block.stem}</p>
                        {block.options?.map((opt, i) => (
                          <p key={i} className="text-sm text-muted-foreground">{String.fromCharCode(65 + i)}. {opt}</p>
                        ))}
                      </div>
                    );
                  case 'formula':
                    return (
                      <div key={block.id} className="text-center py-2 font-mono text-lg">
                        {block.latex}
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-12 pb-8">
        <p className="text-sm text-muted-foreground mb-3">
          此课件由 课研智造 AI 生成，仅供教学参考
        </p>
        <a
          href="/"
          className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
        >
          体验课研智造，免费创建你的 AI 课件 →
        </a>
      </div>
    </div>
  );
}
