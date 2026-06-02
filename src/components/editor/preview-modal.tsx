'use client';

import { useEffect, useRef } from 'react';
import { X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editor-store';
import { useCoursewareStore } from '@/stores/courseware-store';

export function PreviewModal() {
  const { isPreviewOpen, togglePreview } = useEditorStore();
  const { courseware } = useCoursewareStore();
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<unknown>(null);

  useEffect(() => {
    if (!isPreviewOpen || !deckRef.current) return;

    let cancelled = false;

    async function initReveal() {
      const Reveal = (await import('reveal.js')).default;
      if (cancelled) return;

      const deck = new Reveal(deckRef.current!, {
        embedded: true,
        hash: false,
        controls: true,
        progress: true,
        center: true,
        transition: 'slide',
      });

      await deck.initialize();
      if (!cancelled) revealRef.current = deck;
    }

    initReveal();

    return () => {
      cancelled = true;
      if (revealRef.current) {
        const deck = revealRef.current as { destroy?: () => void };
        deck.destroy?.();
      }
    };
  }, [isPreviewOpen]);

  if (!isPreviewOpen) return null;

  const slidesHtml = courseware?.slides
    .map(
      (slide) =>
        `<section>${slide.blocks
          .map((b) => {
            switch (b.type) {
              case 'title':
                return `<h2 style="font-size:1.8em;font-weight:bold">${b.content}</h2>`;
              case 'text':
                return `<p>${b.content}</p>`;
              case 'image':
                return b.url
                  ? `<img src="${b.url}" alt="${b.alt}" style="max-height:60vh" />`
                  : `<p><em>[图片：${b.prompt}]</em></p>`;
              case 'formula':
                return `<div class="katex-formula">\\[${b.latex}\\]</div>`;
              case 'question':
                return `<div class="question-block"><p><strong>${b.stem}</strong></p>${(b.options || []).map((o, i) => `<p>${String.fromCharCode(65 + i)}. ${o}</p>`).join('')}</div>`;
              case 'chart':
                return `<p><em>[图表]</em></p>`;
              default:
                return '';
            }
          })
          .join('')}</section>`
    )
    .join('') || '';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Close button */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="icon" onClick={togglePreview} className="text-white hover:bg-white/20">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Reveal.js container */}
      <div
        ref={deckRef}
        className="reveal flex-1"
        dangerouslySetInnerHTML={{ __html: `<div class="slides">${slidesHtml}</div>` }}
      />
    </div>
  );
}
