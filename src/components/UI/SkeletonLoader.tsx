// components/UI/SkeletonLoader.tsx
import { FC } from 'react';

const SkeletonLoader: FC = () => (
  <div className="space-y-4 p-4">
    <div className="animate-pulse space-y-4">
      <div className="bg-gray-300 rounded h-8 w-full"></div>
      <div className="bg-gray-300 rounded h-8 w-full"></div>
      <div className="bg-gray-300 rounded h-8 w-full"></div>
      <div className="bg-gray-300 rounded h-8 w-full"></div>
    </div>
  </div>
);

export default SkeletonLoader;
