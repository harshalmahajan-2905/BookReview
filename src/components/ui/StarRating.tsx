import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 'md',
  showValue = false,
  readOnly = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= rating;
    const isHalf = !isFilled && starValue - 0.5 === rating;

    return (
      <button
        key={index}
        type="button"
        onClick={() => !readOnly && onRatingChange && onRatingChange(starValue)}
        disabled={readOnly}
        className={`${
          readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
        } transition-transform ${
          isFilled ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        <Star
          className={`${sizeClasses[size]} ${
            isFilled ? 'fill-current' : isHalf ? 'fill-current opacity-50' : ''
          }`}
        />
      </button>
    );
  });

  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">{stars}</div>
      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;