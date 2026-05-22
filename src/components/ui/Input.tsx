import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[hsl(240_5%_70%)]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(240_5%_48%)]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-xl border border-[hsl(240_15%_18%)]
            bg-[hsl(240_22%_8%)] px-4 py-2.5 text-sm text-[hsl(240_10%_98%)]
            placeholder:text-[hsl(240_5%_48%)]
            focus:outline-none focus:border-[hsl(263_90%_64%)]
            focus:ring-2 focus:ring-[hsl(263_90%_64%)/0.2]
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
