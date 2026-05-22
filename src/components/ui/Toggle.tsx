'use client';

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({ checked, onChange, label, disabled = false, id }: ToggleProps) {
  const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'toggle';

  return (
    <label
      htmlFor={toggleId}
      className={`inline-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <button
        type="button"
        role="switch"
        id={toggleId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-[hsl(263_90%_64%)] focus:ring-offset-2 focus:ring-offset-[hsl(240_25%_4%)]
          ${checked ? 'bg-[hsl(263_90%_64%)]' : 'bg-[hsl(240_15%_18%)]'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0
            transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      {label && <span className="text-sm text-[hsl(240_5%_70%)]">{label}</span>}
    </label>
  );
}
