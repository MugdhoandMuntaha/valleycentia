'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    reviewCount?: number;
    showReviews?: boolean;
}

export default function StarRating({ rating, reviewCount = 0, showReviews = true }: StarRatingProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-green-600 text-green-600" />
                <span className="font-semibold" style={{ color: '#000000' }}>
                    {rating.toFixed(1)}
                </span>
            </div>
            {showReviews && reviewCount > 0 && (
                <span className="text-sm" style={{ color: '#6B7280', backgroundColor: 'transparent' }}>
                    | {reviewCount} Reviews
                </span>
            )}
        </div>
    );
}
