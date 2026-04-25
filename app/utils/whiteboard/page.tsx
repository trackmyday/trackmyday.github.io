import type { Metadata } from "next";
import Whiteboard from "./Whiteboard";

export const metadata: Metadata = {
  title: "Whiteboard | Track My Day",
  description: "A collaborative whiteboard for your ideas.",
  manifest: "/api/manifest?app=whiteboard",
};

export default function WhiteboardPage() {
  return <Whiteboard />;
}
