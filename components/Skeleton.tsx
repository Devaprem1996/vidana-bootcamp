
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="w-full h-2 rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="w-16 h-8 rounded-lg" />
      </div>
    </div>
  </div>
);
