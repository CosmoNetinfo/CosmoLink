import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

export function Logo({ size = 'md', showText = true, className = '', href = '/' }: LogoProps) {
  const heights = {
    sm: 24,
    md: 36,
    lg: 48,
  };

  const h = heights[size] || 36;

  return (
    <a href={href} className={`inline-flex select-none ${className}`} style={{ textDecoration: 'none' }}>
      <Image
        src="/mascot.png"
        alt="CosmoLink"
        height={h}
        width={100}
        style={{ width: 'auto', height: `${h}px` }}
        priority
      />
    </a>
  );
}
