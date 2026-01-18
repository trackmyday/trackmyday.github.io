import React from 'react';
import { TETROMINOS, TetrominoKey } from './constants';

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

const NextPiece = ({ piece }: { piece: (TetrominoKey | 0)[][] }) => {
    // Create a 4x4 grid for the preview
    const grid = Array.from(Array(4), () => Array(4).fill(0));

    // Center the piece in the grid
    const shape = piece;
    const shapeWidth = shape[0]?.length || 0;
    const shapeHeight = shape.length;
    const colOffset = Math.floor((4 - shapeWidth) / 2);
    const rowOffset = Math.floor((4 - shapeHeight) / 2);

    shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell !== 0) {
                grid[y + rowOffset][x + colOffset] = cell;
            }
        });
    });

  return (
    <div className="grid grid-cols-4 gap-px">
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`w-5 h-5 ${colorMap[cell as TetrominoKey | 0]} rounded-sm`}
          />
        ))
      )}
    </div>
  );
};

export default NextPiece;
