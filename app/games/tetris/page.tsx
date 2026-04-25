import type { Metadata } from "next";
import TetrisGame from "./TetrisGame";

export const metadata: Metadata = {
  title: "Tetris | Track My Day",
  description: "Play a classic game of Tetris.",
  manifest: "/manifests/tetris.webmanifest",
};

export default function TetrisPage() {
  return <TetrisGame />;
}
