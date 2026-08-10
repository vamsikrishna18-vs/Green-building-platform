import React from 'react';
import { RATING_COLORS } from '../../utils/constants';
import { Award, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function RatingBadge({ rating, size = 'md' }) {
  const config = RATING_COLORS[rating] || RATING_COLORS['Needs Improvement'];

  let Icon = Award;
  if (rating === 'Excellent') Icon = Award;
  else if (rating === 'Good') Icon = CheckCircle;
  else if (rating === 'Moderate') Icon = AlertTriangle;
  else if (rating === 'Needs Improvement') Icon = AlertOctagon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold space-x-1',
    md: 'px-3 py-1 text-sm font-semibold space-x-1.5',
    lg: 'px-4 py-1.5 text-base font-bold space-x-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${config.badge} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      <span>{rating}</span>
    </span>
  );
}
