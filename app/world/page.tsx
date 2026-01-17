import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "World | Track My Day",
  description: "Hello World",
};

export default function World() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400">
      <div className="text-white text-4xl font-bold drop-shadow-lg">
        hello world
      </div>
    </div>
  );
}
