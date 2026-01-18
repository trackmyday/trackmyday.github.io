'use client';

import { useState, useCallback, useEffect } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS, TetrominoKey } from './constants';

// Types
export type Board = (TetrominoKey | 0)[][];
type Piece = {
  pos: { x: number; y: number };
  tetromino: (TetrominoKey | 0)[][];
  collided: boolean;
};

// Helper to create an empty board
const createEmptyBoard = (): Board => Array.from(Array(BOARD_HEIGHT), () => Array(BOARD_WIDTH).fill(0));

// Custom hook for game logic
export const useTetris = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [piece, setPiece] = useState<Piece>({
    pos: { x: 0, y: 0 },
    tetromino: [], // Start with empty
    collided: false,
  });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [nextPiece, setNextPiece] = useState<Piece>({
    pos: { x: 0, y: 0 },
    tetromino: [],
    collided: false,
  });

  const startGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(0);
    setGameOver(false);
    setIsStarted(true);

    const tetrominoKeys = Object.keys(TETROMINOS) as TetrominoKey[];
    const randomTetrominoKey1 = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
    const randomTetrominoKey2 = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
    
    const newPiece = {
      pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
      tetromino: TETROMINOS[randomTetrominoKey1].shape,
      collided: false,
    };
    const newNextPiece = {
      pos: { x: 0, y: 0 }, // Position doesn't matter for preview
      tetromino: TETROMINOS[randomTetrominoKey2].shape,
      collided: false,
    };

    setPiece(newPiece);
    setNextPiece(newNextPiece);
  };

  const checkCollision = (p: Piece, b: Board): boolean => {
    for (let y = 0; y < p.tetromino.length; y++) {
      for (let x = 0; x < p.tetromino[y].length; x++) {
        if (p.tetromino[y][x] !== 0) {
          if (
            !b[y + p.pos.y] ||
            b[y + p.pos.y][x + p.pos.x] === undefined ||
            b[y + p.pos.y][x + p.pos.x] !== 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const movePiece = (dir: number) => {
    if (gameOver || !isStarted) return;
    const newPiece = { ...piece, pos: { ...piece.pos, x: piece.pos.x + dir } };
    if (!checkCollision(newPiece, board)) {
      setPiece(newPiece);
    }
  };

  const rotateMatrix = (matrix: (TetrominoKey | 0)[][]) => {
    const rotated = matrix.map((_, index) => matrix.map(col => col[index]));
    return rotated.map(row => row.reverse());
  };

  const rotatePiece = () => {
    if (gameOver || !isStarted) return;
    const newPiece = JSON.parse(JSON.stringify(piece));
    newPiece.tetromino = rotateMatrix(newPiece.tetromino);

    const originalPos = newPiece.pos.x;
    let offset = 1;
    while (checkCollision(newPiece, board)) {
      newPiece.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > newPiece.tetromino[0].length + 1) {
        newPiece.tetromino = rotateMatrix(newPiece.tetromino); // rotate back
        newPiece.pos.x = originalPos;
        return;
      }
    }
    setPiece(newPiece);
  };
  
  const drop = useCallback(() => {
    if (gameOver || !isStarted) return;
    
    const newPiece = { ...piece, pos: { ...piece.pos, y: piece.pos.y + 1 } };
    if (!checkCollision(newPiece, board)) {
      setPiece(newPiece);
    } else {
      if (piece.pos.y < 1) {
        setGameOver(true);
        setIsStarted(false);
      }
      setPiece({ ...piece, collided: true });
    }
  }, [board, gameOver, isStarted, piece]);
  
  const hardDrop = () => {
    if (gameOver || !isStarted) return;
    const newPiece = { ...piece };
    while (!checkCollision({ ...newPiece, pos: { ...newPiece.pos, y: newPiece.pos.y + 1 } }, board)) {
      newPiece.pos.y += 1;
    }
    setPiece({ ...newPiece, collided: true });
  };

  useEffect(() => {
    if (!piece.collided || gameOver) {
      return;
    }

    const newBoard: Board = JSON.parse(JSON.stringify(board));
    piece.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
        if (value !== 0) {
            newBoard[y + piece.pos.y][x + piece.pos.x] = value;
        }
        });
    });

    let linesCleared = 0;
    for(let y = newBoard.length - 1; y >= 0; y--) {
        if(newBoard[y].every(cell => cell !== 0)) {
            linesCleared++;
            newBoard.splice(y, 1);
            newBoard.unshift(Array(BOARD_WIDTH).fill(0));
            y++;
        }
    }
    
    if (linesCleared > 0) {
        setScore(prev => prev + [0, 40, 100, 300, 1200][linesCleared] * (level + 1));
        setLines(prev => {
            const newTotalLines = prev + linesCleared;
            setLevel(Math.floor(newTotalLines / 10));
            return newTotalLines;
        });
    }

    // Use the nextPiece as the new piece
    const newCurrentPiece = {
      ...nextPiece,
      pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
    };

    // Create a new next piece
    const tetrominoKeys = Object.keys(TETROMINOS) as TetrominoKey[];
    const randomTetrominoKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
    const newNextPiece = {
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[randomTetrominoKey].shape,
        collided: false,
    };

    if (checkCollision(newCurrentPiece, newBoard)) {
        setGameOver(true);
        setIsStarted(false);
    } else {
        setPiece(newCurrentPiece);
        setNextPiece(newNextPiece);
    }
    
    setBoard(newBoard);
  }, [piece.collided, board, level, gameOver, nextPiece, piece.pos.y, piece.pos.x, piece.tetromino]);
  
  
  // Game loop
  const dropInterval = 1000 / (level + 1) + 200;
  useEffect(() => {
    if (!gameOver && isStarted) {
      const interval = setInterval(() => {
        drop();
      }, dropInterval);
      return () => clearInterval(interval);
    }
  }, [gameOver, isStarted, drop, dropInterval]);
  
  return { board, piece, nextPiece, score, lines, level, gameOver, startGame, movePiece, rotatePiece, drop, hardDrop, isStarted };
};