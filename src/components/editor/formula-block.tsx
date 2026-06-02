'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

interface Props {
  latex: string;
}

export function FormulaBlock({ latex }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && latex) {
      try {
        katex.render(latex, ref.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch {
        ref.current.textContent = latex;
      }
    }
  }, [latex]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4" ref={ref}>
      {!latex && <span className="text-muted-foreground text-sm">公式区域</span>}
    </div>
  );
}
