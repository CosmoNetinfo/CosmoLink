import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[hsl(240_25%_4%)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants: Record<string, string> = {
    primary:
      'bg-[hsl(263_90%_64%)] hover:bg-[hsl(263_90%_70%)] text-white focus:ring-[hsl(263_90%_64%)] shadow-lg shadow-[hsl(263_90%_64%)/0.25]',
    secondary:
      'bg-[hsl(240_20%_12%)] hover:bg-[hsl(240_20%_16%)] text-[hsl(240_10%_98%)] border border-[hsl(240_15%_18%)] focus:ring-[hsl(240_15%_18%)]',
    ghost:
      'bg-transparent hover:bg-[hsl(240_20%_12%)] text-[hsl(240_5%_70%)] hover:text-[hsl(240_10%_98%)] focus:ring-[hsl(240_15%_18%)]',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
