
import React, { useState } from 'react';
import { StarIcon } from '../icons/StarIcon';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, className }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = !!onRatingChange;

  return (
    <div className={`flex items-center ${isInteractive ? 'cursor-pointer' : ''} ${className || ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`w-5 h-5 transition-colors ${
            (hoverRating || rating) >= star
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={isInteractive ? () => onRatingChange(star) : undefined}
          onMouseEnter={isInteractive ? () => setHoverRating(star) : undefined}
          onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
        />
      ))}
    </div>
  );
};