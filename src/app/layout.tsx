import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const notoSerifSC = Noto_Serif_SC({
  variable: '--font-noto-serif-sc',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: '课研智造 — AI 驱动教研创新',
    template: '%s — 课研智造',
  },
  description:
    '输入教学内容，AI 自动生成结构完整、图文并茂的课件 PPT。告别熬夜做课件。',
  keywords: ['AI课件', '教案生成', 'PPT制作', '教学辅助', 'AI教育', '课研智造'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: '课研智造 — AI 驱动教研创新',
    description: '让每一位教师都能轻松创建高质量课件',
    type: 'website',
    locale: 'zh_CN',
    siteName: '课研智造',
  },
  twitter: {
    card: 'summary_large_image',
    title: '课研智造 — AI 驱动教研创新',
    description: '让每一位教师都能轻松创建高质量课件',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable} ${notoSerifSC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col grain-overlay">
        <a href="#main-content" className="skip-link">
          跳到内容
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <TooltipProvider delay={300}>
              <Header />
              <main id="main-content" className="flex-1">{children}</main>
              <Footer />
              <Toaster position="top-center" richColors />
            </TooltipProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
