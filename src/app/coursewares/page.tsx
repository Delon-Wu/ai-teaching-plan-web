'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoursewareGrid } from '@/components/courseware/courseware-grid';
import { getStoredInviteCode } from '@/lib/device';

export default function CoursewaresPage() {
  const [hasInvite, setHasInvite] = useState(false);

  useEffect(() => {
    setHasInvite(!!getStoredInviteCode());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-medium">
            课件管理
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">我的课件</h1>
        </div>
        {hasInvite && (
          <Link href="/create">
            <Button className="gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium pressable">
              <Sparkles className="h-4 w-4" />
              创建课件
            </Button>
          </Link>
        )}
      </div>

      <CoursewareGrid />
    </div>
  );
}
