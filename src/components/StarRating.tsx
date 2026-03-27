'use client';

import React, { useId } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  readOnly?: boolean;
}

export function StarRating({ rating, onRatingChange, readOnly = false }: StarRatingProps) {
  const baseId = useId().replace(/:/g, '');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, star: number) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      onRatingChange(star - 0.5);
    } else {
      onRatingChange(star);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = rating >= star;
        const isHalf = !isFull && rating >= star - 0.5;
        const gradId = `half-${baseId}-${star}`;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={(e) => handleClick(e, star)}
            className={`focus:outline-none transition-colors relative ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            style={{ touchAction: 'manipulation' }} // Prevents double-tap zooming on mobile
          >
            {/* SVG Star */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="#1e3a8a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 sm:w-8 sm:h-8"
            >
              <defs>
                <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#1e3a8a" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={isFull ? '#1e3a8a' : isHalf ? `url(#${gradId})` : 'transparent'}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
