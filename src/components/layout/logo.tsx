import Link from 'next/link';
import Image from 'next/image';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const widths = { sm: 160, md: 200, lg: 240 };
  const w = widths[size];

  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <Image
        src="/logo.svg"
        alt="课研智造"
        width={w}
        height={w * 0.25}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}
