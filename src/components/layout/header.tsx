'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStoredInviteCode } from '@/lib/device';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/coursewares', label: '课件' },
];

export function Header() {
  const pathname = usePathname();
  const [hasInvite, setHasInvite] = useState(false);

  useEffect(() => {
    setHasInvite(!!getStoredInviteCode());
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-6">
        <Logo />

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'rounded-lg font-normal',
                  pathname === link.href
                    ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Button>
            </Link>
          ))}

          {hasInvite && (
            <Link href="/create" className="ml-2">
              <Button size="sm" className="gap-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium pressable">
                <FilePlus className="h-4 w-4" />
                创建课件
              </Button>
            </Link>
          )}

          <div className="ml-1">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
