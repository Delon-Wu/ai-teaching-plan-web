'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredInviteCode } from '@/lib/device';
import { useUserStore } from '@/stores/user-store';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function InviteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isInitialized } = useUserStore();
  const [hasCode, setHasCode] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isInitialized) return;
    const code = getStoredInviteCode();
    setHasCode(!!code);
    if (!code) {
      // Redirect after a brief delay so the user sees the message
      const timer = setTimeout(() => router.replace('/'), 2000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, router]);

  if (!isInitialized || hasCode === null) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!hasCode) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-sm px-6 py-20">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="h-8 w-8 text-destructive/60" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            需要邀请码
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            创建课件功能需要有效的邀请码。正在跳转至首页…
          </p>
          <Link href="/">
            <Button variant="outline" className="rounded-xl border-border/60">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
