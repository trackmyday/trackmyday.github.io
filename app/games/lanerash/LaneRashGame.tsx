"use client";

import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';

const TRACK_WIDTH = 400;
const BIKE_WIDTH = 30;
const BIKE_HEIGHT = 50;
const PLAYER_SPEED = 5;
const ENEMY_SPEED_MIN = 3;
const ENEMY_SPEED_MAX = 7;
const ENEMY_SPAWN_INTERVAL = 1500; // milliseconds

interface Bike {
  id: number;
  x: number;
  y: number;
  speed: number;
}

const LaneRashGame: React.FC = () => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [playerBike, setPlayerBike] = useState<Bike>({ id: 0, x: TRACK_WIDTH / 2 - BIKE_WIDTH / 2, y: 0, speed: PLAYER_SPEED });
  const [enemyBikes, setEnemyBikes] = useState<Bike[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  useLayoutEffect(() => {
    if (gameAreaRef.current) {
      setPlayerBike(prev => ({ ...prev, y: gameAreaRef.current!.offsetHeight - BIKE_HEIGHT - 50 }));
    }
  }, []);

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    setPlayerBike(prev => {
      let newX = prev.x;
      if (direction === 'left') {
        newX = Math.max(0, prev.x - PLAYER_SPEED * 2);
      } else {
        newX = Math.min(TRACK_WIDTH - BIKE_WIDTH, prev.x + PLAYER_SPEED * 2);
      }
      return { ...prev, x: newX };
    });
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        movePlayer('left');
      } else if (e.key === 'ArrowRight') {
        movePlayer('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      // Move enemy bikes
      setEnemyBikes(prev =>
        prev
          .map(bike => ({ ...bike, y: bike.y + bike.speed }))
          .filter(bike => gameAreaRef.current && bike.y < gameAreaRef.current.offsetHeight) // Remove bikes that are off-screen
      );

      // Check for collisions
      enemyBikes.forEach(enemy => {
        if (
          playerBike.x < enemy.x + BIKE_WIDTH &&
          playerBike.x + BIKE_WIDTH > enemy.x &&
          playerBike.y < enemy.y + BIKE_HEIGHT &&
          playerBike.y + BIKE_HEIGHT > enemy.y
        ) {
          setGameOver(true);
          clearInterval(gameLoop);
        }
      });

      // Update score
      setScore(prev => prev + 1);
    }, 50); // Game update every 50ms

    return () => clearInterval(gameLoop);
  }, [playerBike, enemyBikes, gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const spawnEnemy = setInterval(() => {
      const randomX = Math.random() * (TRACK_WIDTH - BIKE_WIDTH);
      const randomSpeed = ENEMY_SPEED_MIN + Math.random() * (ENEMY_SPEED_MAX - ENEMY_SPEED_MIN);
      setEnemyBikes(prev => [
        ...prev,
        { id: Date.now(), x: randomX, y: -BIKE_HEIGHT, speed: randomSpeed },
      ]);
    }, ENEMY_SPAWN_INTERVAL);

    return () => clearInterval(spawnEnemy);
  }, [gameOver, isPaused]);

  const restartGame = () => {
    if (gameAreaRef.current) {
      setPlayerBike({ id: 0, x: TRACK_WIDTH / 2 - BIKE_WIDTH / 2, y: gameAreaRef.current!.offsetHeight - BIKE_HEIGHT - 50, speed: PLAYER_SPEED });
    }
    setEnemyBikes([]);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div
      ref={gameAreaRef}
      className="relative overflow-hidden"
      style={{
        width: TRACK_WIDTH,
        height: '600px',
        border: '5px solid black',
        backgroundColor: '#222', // Solid dark road color
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          transparent 0px,
          transparent 70px,
          rgba(255, 255, 255, 0.145) 70px,
          #8f8f8f 100px
        )`, // White dashed lines for lanes
        backgroundSize: `100% 100px`, // Vertical repeat every 100px
        backgroundPosition: `center top`, // Animate background-position-y
        animation: 'roadScroll 2s linear infinite' // Add animation for scrolling road
      }}
    >
      <div className="absolute top-2 left-2 text-white text-lg">Score: {score}</div>
      <button
        onClick={togglePause}
        className="absolute top-2 right-2 px-4 py-2 bg-gray-600 text-white rounded z-30"
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>

      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white text-4xl z-20">
          PAUSED
        </div>
      )}

      {playerBike && (
        <div
          className="absolute bg-blue-500"
          style={{
            width: BIKE_WIDTH,
            height: BIKE_HEIGHT,
            left: playerBike.x,
            top: playerBike.y,
            borderRadius: '50% 50% 10% 10% / 60% 60% 10% 10%', // More bike-like shape
            boxShadow: '0 0 10px rgba(0,0,255,0.7)',
          }}
        ></div>
      )}
      {enemyBikes.map(bike => (
        <div
          key={bike.id}
          className="absolute bg-red-500"
          style={{
            width: BIKE_WIDTH,
            height: BIKE_HEIGHT,
            left: bike.x,
            top: bike.y,
            borderRadius: '50% 50% 10% 10% / 60% 60% 10% 10%', // Similar bike shape
            boxShadow: '0 0 8px rgba(255,0,0,0.6)', // Red shadow
          }}
        ></div>
      ))}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white text-3xl">
          <p>Game Over!</p>
          <p>Final Score: {score}</p>
          <button
            onClick={restartGame}
            className="mt-4 px-6 py-2 bg-green-500 rounded text-xl"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default LaneRashGame;