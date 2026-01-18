'use client';

import React, { useEffect, useCallback } from 'react';
import TetrisBoard from './TetrisBoard';
import NextPiece from './NextPiece';
import { useTetris } from './useTetris';

const StatBox = ({ title, value }: { title: string; value: string | number }) => (
    <div className='flex justify-between items-center'>
        <h3 className='text-sm font-bold uppercase text-slate-300'>{title}</h3>
        <p className='font-mono text-xl text-white'>{value}</p>
    </div>
);

const TetrisGame = () => {
  const { board, piece, nextPiece, score, lines, level, gameOver, startGame, movePiece, rotatePiece, drop, hardDrop, isStarted } = useTetris();

  const displayBoard = React.useMemo(() => {
    const newBoard = JSON.parse(JSON.stringify(board));
    if (piece.tetromino.length > 0) {
        piece.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = y + piece.pos.y;
                const boardX = x + piece.pos.x;
                if (newBoard[boardY] && newBoard[boardY][boardX] !== undefined) {
                    newBoard[boardY][boardX] = value;
                }
            }
            });
        });
    }
    return newBoard;
  }, [board, piece]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && gameOver) {
        startGame();
        return;
    }
    if (!isStarted || gameOver) return;
    
    // Stop event propagation for game controls to prevent page scroll, etc.
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === 'ArrowLeft') movePiece(-1);
    else if (e.key === 'ArrowRight') movePiece(1);
    else if (e.key === 'ArrowDown') drop();
    else if (e.key === 'ArrowUp') rotatePiece();
    else if (e.key === ' ') hardDrop();
  }, [gameOver, isStarted, startGame, movePiece, drop, rotatePiece, hardDrop]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);


  return (
    <div className="w-full min-h-[calc(100vh-12rem)] flex items-center justify-center p-4 focus:outline-none bg-slate-900" tabIndex={0}>
        <div className='w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8'>
            
            {/* Left Panel */}
            <div className='flex flex-col gap-4 order-2 lg:order-1'>
                <div className='p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-slate-700 space-y-3'>
                    <StatBox title="Score" value={score} />
                    <StatBox title="Lines" value={lines} />
                    <StatBox title="Level" value={level} />
                </div>
                <button
                    onClick={startGame}
                    className="w-full px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    {isStarted && !gameOver ? 'New Game' : 'Start Game'}
                </button>
            </div>

            {/* Center Panel - Game Board */}
            <div className='flex items-center justify-center order-1 lg:order-2 lg:col-span-3 relative'>
                {gameOver && (
                    <div className='absolute z-10 flex flex-col items-center gap-4 text-center'>
                        <h2 className='text-5xl font-extrabold text-white'>GAME OVER</h2>
                        <button
                            onClick={startGame}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            Play Again
                        </button>
                    </div>
                )}
                <div className={`${gameOver ? 'opacity-20' : ''}`}>
                    <TetrisBoard board={displayBoard} />
                </div>
            </div>

            {/* Right Panel */}
            <div className='flex flex-col gap-4 order-3 lg:order-3'>
                <div className='p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-slate-700'>
                    <h3 className='text-sm font-bold uppercase text-slate-300 mb-3'>Next</h3>
                    <div className='flex items-center justify-center h-20'>
                        {nextPiece.tetromino.length > 0 && <NextPiece piece={nextPiece.tetromino} />}
                    </div>
                </div>
                 <div className='p-4 text-sm text-slate-400 bg-black/30 backdrop-blur-sm rounded-lg border border-slate-700 space-y-2'>
                    <h3 className='text-sm font-bold uppercase text-slate-300 mb-2'>Controls</h3>
                    <p className='flex justify-between'><span>Move</span> <span className='font-mono text-xs bg-slate-700 px-2 py-1 rounded'>← →</span></p>
                    <p className='flex justify-between'><span>Rotate</span> <span className='font-mono text-xs bg-slate-700 px-2 py-1 rounded'>↑</span></p>
                    <p className='flex justify-between'><span>Soft Drop</span> <span className='font-mono text-xs bg-slate-700 px-2 py-1 rounded'>↓</span></p>
                    <p className='flex justify-between'><span>Hard Drop</span> <span className='font-mono text-xs bg-slate-700 px-2 py-1 rounded'>Space</span></p>
                </div>
            </div>

        </div>
    </div>
  );
};

export default TetrisGame;
