import React from 'react';
import { BOARD_WIDTH, TETROMINOS } from './constants';

type Board = (keyof typeof TETROMINOS | 0)[][];

const colorMap: Record<keyof typeof TETROMINOS | 0, string> = {
    0: 'bg-transparent',
    I: 'bg-cyan-400',
    J: 'bg-blue-500',
    L: 'bg-orange-500',
    O: 'bg-yellow-400',
    S: 'bg-green-500',
    T: 'bg-purple-600',
    Z: 'bg-red-500',
};

const borderColorMap: Record<keyof typeof TETROMINOS | 0, string> = {
    0: 'border-slate-800',
    I: 'border-cyan-200',
    J: 'border-blue-300',
    L: 'border-orange-300',
    O: 'border-yellow-200',
    S: 'border-green-300',
    T: 'border-purple-400',
    Z: 'border-red-300',
}

const Cell = ({ type }: { type: keyof typeof TETROMINOS | 0 }) => {
  const colorClass = colorMap[type];
  const borderClass = borderColorMap[type];

  return (
    <div
      className={`w-full aspect-square border-b border-r ${colorClass} ${borderClass}`}
    />
  );
};

interface TetrisBoardProps {
  board: Board;
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ board }) => {
  return (
    <div
      className="grid bg-slate-900 border-t-4 border-l-4 border-slate-700"
      style={{
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
        width: 'auto', // Let parent control width
        minHeight: 'calc(100vh - 15rem)',
        aspectRatio: '10 / 20', // Maintain aspect ratio
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell} />)
      )}
    </div>
  );
};

export default TetrisBoard;
