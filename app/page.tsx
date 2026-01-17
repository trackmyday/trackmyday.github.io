import Link from "next/link";

interface RouteCard {
  title: string;
  description: string;
  href: string;
  emoji: string;
  status: "available" | "coming-soon";
}

const routes: RouteCard[] = [
  {
    title: "Goals & Habits",
    description: "Track your daily goals and build consistency with our monthly goals tracker.",
    href: "/goals",
    emoji: "🎯",
    status: "available",
  },
  {
    title: "Start Your Day",
    description: "Plan and organize your daily tasks and activities.",
    href: "https://startmyday.github.io/manage",
    emoji: "🌅",
    status: "available",
  },
];

const Feature = ({ icon, title, children }: { icon: string, title: string, children: React.ReactNode }) => (
  <div className="text-center p-6 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
    <div className="text-5xl mb-4">{icon}</div>
    <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h4>
    <p className="text-slate-600 dark:text-slate-400">{children}</p>
  </div>
);

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-16 relative">
          <div className="hidden dark:block absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-pink-500/30 rounded-full blur-3xl opacity-50"></div>
          <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 relative">
            Your Personal
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-pink-400 bg-clip-text text-transparent mt-2">
              Productivity Hub
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 relative">
            Track your habits, manage your goals, and build a better you, one day at a time.
          </p>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group relative overflow-hidden rounded-2xl p-8 
                         bg-white dark:bg-white/5 dark:backdrop-blur-lg 
                         border border-slate-200 dark:border-white/10 
                         hover:border-indigo-500 dark:hover:border-cyan-400/50 
                         transition-all duration-300 
                         transform hover:-translate-y-1 
                         shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-cyan-500/10"
            >
              <div className="relative z-10">
                <div className="text-6xl mb-4 transition-transform duration-300 transform group-hover:scale-110 dark:group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  {route.emoji}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                  {route.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {route.description}
                </p>
                <div className="flex items-center text-indigo-600 dark:text-cyan-400 font-semibold group-hover:gap-2 transition-all">
                  <span>Get Started</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
                {route.status === "coming-soon" && (
                  <div className="mt-4 inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-400/20 text-yellow-800 dark:text-yellow-300 text-sm font-medium rounded-full">
                    Coming Soon
                  </div>
                )}
              </div>
            </Link>
          ))}

          {/* Placeholder for future routes */}
          <div className="rounded-2xl bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/20 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="text-6xl mb-4 opacity-50 dark:opacity-30">⚡️</div>
            <h3 className="text-xl font-semibold text-slate-500 dark:text-white/50 mb-2">More Tools Coming</h3>
            <p className="text-slate-400 dark:text-slate-400 text-sm">
              New tracking utilities will appear here
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-28 md:mt-36 max-w-5xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Why Track My Day?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature icon="📈" title="Track Progress">
              Visualize your progress with detailed analytics and insights to stay motivated.
            </Feature>
            <Feature icon="🔒" title="Local Storage">
              Your data stays private and secure, stored directly in your browser. No cloud, no accounts.
            </Feature>
            <Feature icon="✨" title="Minimal Design">
              Enjoy a clean, modern interface that's a joy to use in light or dark mode.
            </Feature>
          </div>
        </div>
      </div>
  );
}