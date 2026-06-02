'use client';

import ReactECharts from 'echarts-for-react';

interface Props {
  chartType: 'bar' | 'line' | 'pie' | 'radar' | 'scatter';
  data: Record<string, unknown>;
}

export function ChartBlock({ chartType, data }: Props) {
  const options = data as Record<string, unknown>;

  return (
    <div className="w-full h-full min-h-[200px]">
      <ReactECharts
        option={{
          ...options,
          tooltip: { trigger: 'axis', ...((options.tooltip as object) || {}) },
        }}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
