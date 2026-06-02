'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  description: string;
  icon: LucideIcon;
  loading: boolean;
  onClick: () => void;
}

export function AiToolButton({ label, description, icon: Icon, loading, onClick }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={loading}
            className="w-full justify-start gap-2 h-9 text-sm font-normal"
          />
        }
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          <Icon className="h-4 w-4 shrink-0" />
        )}
        <span className="truncate">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-[200px]">
        <p className="text-xs">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
