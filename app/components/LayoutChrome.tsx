"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

const CHROMELESS_ROUTES = ["/utils/counter"];
const CHROMELESS_ROUTE_PREFIXES = ["/games/"];

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChromelessRoute =
    CHROMELESS_ROUTES.includes(pathname) ||
    CHROMELESS_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isChromelessRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
