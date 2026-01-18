import React from 'react';
import LaneRashGame from './LaneRashGame';

const LaneRashGamePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Lane Rash Game</h1>
      <LaneRashGame />
    </div>
  );
};

export default LaneRashGamePage;