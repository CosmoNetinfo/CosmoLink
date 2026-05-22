import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-[hsl(240_15%_18%)]
        bg-[hsl(240_20%_12%)]
        ${hover ? 'transition-all duration-300 hover:border-[hsl(263_90%_64%)/0.3] hover:shadow-lg hover:shadow-[hsl(263_90%_64%)/0.08]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-[hsl(240_15%_18%)] ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}
