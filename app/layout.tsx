import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { LayoutChrome } from "./components/LayoutChrome";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Track My Day | Your Personal Productivity Hub",
  description: "Track your habits, goals, and daily activities with our comprehensive tracking tools",
  manifest: "/manifests/home.webmanifest",
  applicationName: "Track My Day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200`}
      >
        <Providers>
          <ServiceWorkerRegister />
          <LayoutChrome>{children}</LayoutChrome>
        </Providers>
      </body>
    </html>
  );
}
