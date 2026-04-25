import React from 'react';
import type { Metadata } from 'next';
import LaneRashGame from './LaneRashGame';

export const metadata: Metadata = {
  title: "Lane Rash | Track My Day",
  description: "Play Lane Rash",
  manifest: "/manifests/lanerash.webmanifest",
};

const LaneRashGamePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <LaneRashGame />
    </div>
  );
};

export default LaneRashGamePage;
