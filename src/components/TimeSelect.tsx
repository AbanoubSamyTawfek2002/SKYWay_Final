import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeSelectProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  inputClassName?: string;
}

export function TimeSelect({ value, onChange, className, inputClassName }: TimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      times.push(`${hh}:${mm}`);
    }
  }

  const formatTime = (time24: string) => {
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h.toString().padStart(2, '0')}:${mStr} ${ampm}`;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className || 'group'}`} ref={wrapperRef}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors flex items-center pointer-events-none z-10">
        <Clock size={16} />
      </div>
      
      <div 
        className={inputClassName || "w-full pl-10 pr-8 h-16 bg-muted/30 border-none rounded-2xl text-base font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground flex items-center"}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        {value ? formatTime(value) : <span className="text-muted-foreground font-normal">Time</span>}
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-popover dark:bg-[#1E1E1E] text-popover-foreground dark:text-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-border dark:border-white/10 overflow-hidden max-h-60 overflow-y-auto">
          {times.map(t => (
            <div 
              key={t}
              className={`px-4 py-3 cursor-pointer text-sm font-semibold transition-colors hover:bg-primary/20 hover:text-primary ${value === t ? 'bg-primary/10 text-primary border-l-2 border-primary' : ''}`}
              onClick={() => {
                onChange(t);
                setIsOpen(false);
              }}
            >
              {formatTime(t)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
