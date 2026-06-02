import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-sm px-6 py-20">
        <p className="text-8xl font-bold text-brand-100 dark:text-brand-900/30 select-none mb-4">
          404
        </p>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          找不到这个页面
        </h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          链接可能已经失效，或页面已被移动。
        </p>
        <Link href="/">
          <Button variant="outline" className="gap-1.5 rounded-xl border-border/60 pressable">
            <Home className="h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  );
}
