import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-3xl' },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src={process.env.NEXT_PUBLIC_MASCOT_LOGO_URL || '/mascot-logo.png'}
        alt="CosmoLink"
        width={s.icon}
        height={s.icon}
        className="object-contain"
        priority
      />
      {showText && (
        <span
          className={`${s.text} font-bold bg-gradient-to-r from-[hsl(263_90%_64%)] via-[hsl(230_90%_68%)] to-[hsl(190_95%_45%)] bg-clip-text text-transparent`}
        >
          CosmoLink
        </span>
      )}
    </div>
  );
}
