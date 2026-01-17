import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track My Day | Your Personal Productivity Hub",
  description: "Track your habits, goals, and daily activities with our comprehensive tracking tools",
};

interface RouteCard {
  title: string;
  description: string;
  href: string;
  emoji: string;
  gradient: string;
  status: "available" | "coming-soon";
}

const routes: RouteCard[] = [
  {
    title: "Goals & Habits",
    description: "Track your daily goals and build consistency with our monthly goals tracker",
    href: "/goals",
    emoji: "🎯",
    gradient: "from-indigo-600 via-purple-600 to-pink-500",
    status: "available",
  },
  {
    title: "Start Your Day",
    description: "Plan and organize your daily tasks and activities",
    href: "/start",
    emoji: "🌅",
    gradient: "from-purple-500 via-pink-500 to-rose-400",
    status: "available",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Track My Day
          </h1>
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                {route.title}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personal
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Productivity Hub
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Track your habits, manage your goals, and build a better you, one day at a time.
          </p>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${route.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative p-8">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {route.emoji}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {route.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {route.description}
                </p>
                <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Get Started</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
                {route.status === "coming-soon" && (
                  <div className="mt-4 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    Coming Soon
                  </div>
                )}
              </div>
            </Link>
          ))}

          {/* Placeholder for future routes */}
          <div className="rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="text-6xl mb-4 opacity-50">➕</div>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">More Tools Coming</h3>
            <p className="text-gray-400 text-sm">
              New tracking utilities will appear here
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Track My Day?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h4>
              <p className="text-gray-600">
                Visualize your progress with detailed analytics and insights
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💾</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Local Storage</h4>
              <p className="text-gray-600">
                Your data stays private and secure in your browser
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Beautiful Design</h4>
              <p className="text-gray-600">
                Enjoy a clean, modern interface that's easy to use
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>Built with Next.js and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
