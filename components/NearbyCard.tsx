import React from 'react';
import { Compass, Loader2 } from 'lucide-react';

interface NearbyCardProps {
  onClick: () => void;
  isLoading?: boolean;
  isActive?: boolean;
}

export const NearbyCard: React.FC<NearbyCardProps> = ({ onClick, isLoading, isActive }) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 mb-4
        ${isActive 
          ? 'bg-blue-50 border border-blue-500 shadow-sm ring-1 ring-blue-200' 
          : 'bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-md hover:border-blue-300'
        }
      `}
    >
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 transition-colors
        ${isActive ? 'bg-blue-600' : 'bg-blue-500'}
      `}>
        {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
        ) : (
            <Compass size={20} />
        )}
      </div>
      <div>
        <h3 className={`font-semibold text-sm ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
          Discover Nearby Hospitals
        </h3>
        <p className={`text-xs mt-0.5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
          Find top-rated hospitals closest to your location
        </p>
      </div>
    </div>
  );
};