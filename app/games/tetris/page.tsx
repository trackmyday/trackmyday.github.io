import type { Metadata } from "next";
import TetrisGame from "./TetrisGame";

export const metadata: Metadata = {
  title: "Tetris | Track My Day",
  description: "Play a classic game of Tetris.",
  manifest: "/api/manifest?app=tetris",
};

export default function TetrisPage() {
  return <TetrisGame />;
}
