import React, { useState, useRef, useEffect } from 'react';

export interface Option<T = string> {
  id: T;
  label: string;
  icon?: string;
}

interface CustomSelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  icon?: string;
  className?: string;
  ariaLabel?: string;
}

export function CustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  icon,
  className = '',
  ariaLabel = 'Select option'
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#18181b] hover:bg-[#1e1e22] rounded-xl px-4 py-2 border border-[#27272a]/80 focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/40 transition-all text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {icon && (
            <span className="material-symbols-outlined text-[#a78bfa] text-xl select-none shrink-0">
              {icon}
            </span>
          )}
          <span className="text-[13px] font-semibold text-[#fafafa] truncate">
            {selectedOption?.label}
          </span>
        </div>
        <span
          className={`material-symbols-outlined text-[#a1a1aa] group-hover:text-[#fafafa] transition-transform duration-200 shrink-0 text-base ${
            isOpen ? 'rotate-180 text-[#a78bfa]' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#18181b] border border-[#27272a] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.8)] overflow-hidden py-1.5 max-h-72 overflow-y-auto animate-fade-in backdrop-blur-xl">
          {options.map((option) => {
            const isSelected = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-[13px] transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#7c3aed]/20 text-[#ede9fe] font-semibold'
                    : 'text-[#a1a1aa] hover:bg-[#27272a] hover:text-[#fafafa]'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {option.icon && (
                    <span className="material-symbols-outlined text-sm text-[#a78bfa]">
                      {option.icon}
                    </span>
                  )}
                  {option.label}
                </span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[#a78bfa] text-base shrink-0 ml-2">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
