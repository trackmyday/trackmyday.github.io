import type { Metadata } from "next";
import Counter from "@/app/utils/counter/Counter";

export const metadata: Metadata = {
  title: "Counter | Track My Day",
  description: "Tap anywhere to increase your count.",
  manifest: "/api/manifest?app=counter",
};

export default function CounterPage() {
  return <Counter />;
}
