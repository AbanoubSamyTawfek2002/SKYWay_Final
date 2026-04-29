import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  icon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

export function AutocompleteInput({ placeholder, value, onChange, options, icon = <MapPin size={18} />, className, inputClassName }: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative w-full ${className || 'group'}`} ref={wrapperRef}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors flex items-center">
        {icon}
      </div>
      <Input 
        placeholder={placeholder} 
        className={inputClassName || "pl-12 h-16 w-full bg-muted/30 border-none rounded-2xl text-lg font-bold placeholder:font-normal"} 
        value={searchTerm} 
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-[100] w-full mt-2 bg-popover dark:bg-[#1E1E1E] text-popover-foreground dark:text-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-border dark:border-white/10 overflow-hidden max-h-60 overflow-y-auto">
          {filteredOptions.map((opt, i) => (
            <div 
              key={i} 
              className={`px-4 py-3 cursor-pointer text-sm font-semibold transition-colors hover:bg-primary/20 hover:text-primary ${value === opt ? 'bg-primary/10 text-primary border-l-2 border-primary' : ''}`}
              onClick={() => {
                setSearchTerm(opt);
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
      {isOpen && searchTerm.length > 0 && filteredOptions.length === 0 && (
        <div className="absolute z-[100] w-full mt-2 bg-popover dark:bg-[#1E1E1E] text-popover-foreground rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-border dark:border-white/10 p-4 text-center text-sm text-muted-foreground">
          No matches found
        </div>
      )}
    </div>
  );
}
