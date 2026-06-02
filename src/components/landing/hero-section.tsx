import { InviteForm } from './invite-form';
import { StatsCounter } from './stats-counter';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-brand-50/30 to-background dark:from-brand-950/30 dark:via-brand-950/10 dark:to-background">
      {/* Ambient background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-200/20 dark:bg-brand-800/10 blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[var(--copper-200)]/15 dark:bg-[var(--copper-800)]/10 blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-28 sm:pt-32 sm:pb-36 lg:pt-40 lg:pb-44">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left column: text content */}
          <div className="lg:col-span-7 lg:col-start-1">
            {/* Eyebrow */}
            <p className="text-xs tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 font-medium mb-6">
              为教学研究者打造
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-foreground mb-6">
              让每一堂课
              <br />
              <span className="text-brand-500 dark:text-brand-400">
                都有备而来
              </span>
            </h1>

            <p className="max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed mb-10">
              输入教学大纲，AI 自动构建结构完整、图文并茂的课件。
              把时间还给教研，把课件交给机器。
            </p>
          </div>

          {/* Right column: stats and visual element */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-24 space-y-10">
              {/* Stats card */}
              <div className="rounded-2xl bg-white/70 dark:bg-card/70 backdrop-blur border border-border/60 p-6 shadow-sm">
                <p className="text-sm text-muted-foreground mb-1">已帮助</p>
                <StatsCounter />
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  通过 AI 课件生成，累计为教师节省<span className="text-brand-600 dark:text-brand-400 font-medium">超过 50,000 小时</span>备课时间
                </p>
              </div>

              {/* Visual placeholder — abstract illustration area */}
              <div className="hidden lg:block relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-100/60 via-brand-50/30 to-[var(--copper-100)]/40 dark:from-brand-900/40 dark:via-brand-800/20 dark:to-[var(--copper-900)]/20 border border-border/40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="text-6xl mb-3">📐</div>
                    <p className="text-xs text-muted-foreground/70 font-mono">课件结构示意</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invite form — spans full width below hero */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <InviteForm />
        </div>
      </div>
    </section>
  );
}
