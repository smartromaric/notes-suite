import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'text',
  width,
  height 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-lg';
      default:
        return 'rounded';
    }
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`animate-pulse bg-gray-200 ${getVariantClass()} ${className}`}
      style={style}
    />
  );
};

// Skeleton for Note Card
export const NoteCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton variant="circular" width={24} height={24} />
      </div>
      
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16" variant="rectangular" />
        <Skeleton className="h-6 w-20" variant="rectangular" />
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton variant="circular" width={20} height={20} />
      </div>
    </div>
  );
};

// Skeleton for Stats Card
export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <Skeleton variant="rectangular" width={48} height={48} />
        <div className="ml-4 flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for Note Detail
export const NoteDetailSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-20" />
        </div>

        <div className="flex items-center space-x-6 mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" variant="rectangular" />
          <Skeleton className="h-8 w-24" variant="rectangular" />
          <Skeleton className="h-8 w-16" variant="rectangular" />
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for Table Row
export const TableRowSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-24" />
      </div>
      
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" variant="rectangular" />
          <Skeleton className="h-6 w-16" variant="rectangular" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
