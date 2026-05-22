import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'pro' | 'free' | 'success' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-[hsl(240_20%_16%)] text-[hsl(240_5%_70%)] border-[hsl(240_15%_18%)]',
    pro: 'bg-[hsl(263_90%_64%)/0.15] text-[hsl(263_90%_75%)] border-[hsl(263_90%_64%)/0.3]',
    free: 'bg-[hsl(190_95%_45%)/0.15] text-[hsl(190_95%_55%)] border-[hsl(190_95%_45%)/0.3]',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5
        text-xs font-semibold rounded-full border
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
