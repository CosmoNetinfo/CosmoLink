import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { iconWidth: 24, iconHeight: 24, text: 'text-base sm:text-lg' },
    md: { iconWidth: 24, iconHeight: 24, text: 'text-lg sm:text-xl' },
    lg: { iconWidth: 32, iconHeight: 32, text: 'text-2xl sm:text-3xl' },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/mascot-logo.png"
        alt="CosmoLink Mascot Logo"
        width={s.iconWidth}
        height={s.iconHeight}
        className="object-contain block p-0 m-0 border-0 bg-transparent"
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
