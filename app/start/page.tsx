import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start | Track My Day",
  description: "Start",
};

export default function Start() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400">
      <div className="text-white text-4xl font-bold drop-shadow-lg">
        hello start
      </div>
    </div>
  );
}
