import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "India | Track My Day",
  description: "Hello India",
};

export default function India() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400">
      <div className="text-white text-4xl font-bold drop-shadow-lg">
        hello india
      </div>
    </div>
  );
}
