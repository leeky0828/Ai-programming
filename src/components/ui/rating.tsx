'use client';

import * as React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number;
  max?: number;
  readonly?: boolean;
  onChange?: (value: number) => void;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ className, value, max = 5, readonly = false, onChange, ...props }, ref) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const roundedValue = Math.round(value * 2) / 2; // 0.5 단위로 반올림

    const handleClick = (newValue: number) => {
      if (!readonly && onChange) {
        onChange(newValue);
      }
    };

    const handleMouseOver = (newValue: number) => {
      if (!readonly) {
        setHoverValue(newValue);
      }
    };

    const handleMouseLeave = () => {
      setHoverValue(null);
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center', className)}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const isActive = (hoverValue ?? roundedValue) >= starValue;
          const isHalfActive =
            (hoverValue ?? roundedValue) === starValue - 0.5;

          return (
            <button
              key={index}
              type="button"
              className={cn(
                'text-muted-foreground cursor-default inline-flex',
                !readonly && 'cursor-pointer transition-colors',
                (isActive || isHalfActive) && 'text-yellow-500'
              )}
              onClick={() => handleClick(starValue)}
              onMouseOver={() => handleMouseOver(starValue)}
              disabled={readonly}
            >
              {isHalfActive ? (
                <StarHalf className="w-5 h-5 fill-current" />
              ) : (
                <Star className={cn('w-5 h-5', isActive && 'fill-current')} />
              )}
            </button>
          );
        })}
      </div>
    );
  }
);

Rating.displayName = 'Rating';

export { Rating }; 