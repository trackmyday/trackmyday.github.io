import type { Metadata } from "next";
import HabitTracker from "./HabitTracker";

export const metadata: Metadata = {
  title: "Goals | Track My Day",
  description: "Daily Goals Tracker",
  manifest: "/manifests/goals.webmanifest",
};

export default function Goals() {
  return <HabitTracker />;
}
