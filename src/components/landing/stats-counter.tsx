'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

export function StatsCounter() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, 12860, {
      duration: 2.2,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView]);

  return (
    <div className="flex items-baseline gap-1.5 text-brand-600 dark:text-brand-400">
      <span className="text-[2.25rem] font-bold tabular-nums leading-none tracking-tight" ref={ref}>
        {count.toLocaleString()}
      </span>
      <span className="text-base font-medium">位教师</span>
    </div>
  );
}
