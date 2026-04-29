import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategorySliderProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  className
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn("relative group px-4 sm:px-0", className)}>
      {/* Left Arrow */}
      {showLeftArrow && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background h-10 w-10 border border-border/50"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={20} />
          </Button>
        </div>
      )}

      {/* Categories container */}
      <div
        ref={scrollRef}
        onScroll={checkArrows}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-4"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2",
              activeCategory === category
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/20"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background h-10 w-10 border border-border/50"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}
      
      {/* Scroll indicator for mobile */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1 sm:hidden">
         <div className="w-8 h-1 rounded-full bg-muted/20" />
      </div>
    </div>
  );
};
