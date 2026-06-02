import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} 课研智造</span>
          <Link href="/" className="hover:text-foreground transition-colors">
            首页
          </Link>
          <span className="hidden sm:inline text-border/60">|</span>
          <span className="hidden sm:inline text-xs">
            隐私政策 &middot; 服务条款
          </span>
        </div>
        <p className="text-xs text-muted-foreground/70">
          内容由 AI 生成，仅供教学参考，请教师根据实际情况调整
        </p>
      </div>
    </footer>
  );
}
