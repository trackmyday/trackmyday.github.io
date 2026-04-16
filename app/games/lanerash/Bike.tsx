"use client";

import React from 'react';

interface BikeProps {
  color: 'blue' | 'red';
  rotation?: number; // Added for explosion effect
  className?: string; // Added for additional styling
}

const Bike: React.FC<BikeProps> = ({ color, rotation = 0, className = '' }) => {
  const primaryColor = color === 'blue' ? '#3b82f6' : '#ef4444';
  const shadowColor = color === 'blue' ? 'rgba(59, 130, 246, 0.7)' : 'rgba(239, 68, 68, 0.6)';
  const lightColor = color === 'blue' ? '#fde047' : '#f97316';

  return (
    <div
      className={`relative w-[40px] h-[65px] transform transition-transform duration-100 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Bike Body */}
      <div
        className="absolute top-[10px] left-[5px] w-[30px] h-[45px] rounded-t-lg"
        style={{
          backgroundColor: primaryColor,
          boxShadow: `0 0 15px ${shadowColor}`,
          border: `2px solid ${color === 'blue' ? '#2563eb' : '#dc2626'}`,
        }}
      >
        {/* Rider */}
        <div 
          className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[18px] h-[22px] bg-gray-800 rounded-t-full"
          style={{ border: '2px solid #333' }}
        >
          {/* Helmet Visor */}
          <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[14px] h-[6px] bg-cyan-300 opacity-70 rounded-sm"></div>
        </div>
        {/* Headlight */}
        <div
          className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full"
          style={{
            backgroundColor: lightColor,
            boxShadow: `0 0 10px 2px ${lightColor}`,
          }}
        />
        {/* Taillight */}
        <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-[12px] h-[6px] bg-red-600 rounded-sm"></div>
      </div>
      
      {/* Wheels */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[14px] h-[14px] bg-gray-700 rounded-full border-2 border-gray-500"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[18px] h-[18px] bg-gray-700 rounded-full border-2 border-gray-500"></div>
    </div>
  );
};

export default Bike;