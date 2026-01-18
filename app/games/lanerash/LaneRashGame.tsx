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
        backgroundColor: '#222', // Slightly lighter base for texture
        // Multi-layered road effect with varied line styles and speeds
        backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.3) 100%), /* Subtle road texture */
          linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), /* Fine vertical lines */
          linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 42%, transparent 42%, transparent 100%),
          repeating-linear-gradient(
            to bottom,
            #333 0px,
            #333 90px,
            #555 90px,
            #555 100px
          ),
          repeating-linear-gradient(
            to bottom,
            white 0px,
            white 50px,
            transparent 50px,
            transparent 100px
          )
        `,
        backgroundSize: `100% 600px, 100% 100px, 100% 100px`, // Sizes for each layer
        backgroundPosition: `center top, center top, center top`,
        animation: `roadScroll 1s linear infinite, backgroundScroll 1s linear infinite`, // Multiple animations
      }}
    >
            <style>{`
              @keyframes roadScroll {
                from { background-position-y: 0px, 0px, 0px; }
                to { background-position-y: 600px, 600px, 600px; }
              }
              @keyframes backgroundScroll {
                from { background-position-y: 0px; }
                to { background-position-y: 600px; }
              }
                      @keyframes sideScroll {
                        from { background-position-y: 0px; }
                        to { background-position-y: 600px; } /* Aligned with roadScroll distance */
                      }            `}</style>
            
            {/* Left Barrier */}
            <div 
              className="absolute left-0 top-0 h-full w-10 bg-gray-700" 
              style={{
                borderRight: '2px solid #555',
                backgroundImage: `repeating-linear-gradient(to bottom, #888 0px, #888 10px, transparent 10px, transparent 20px)`,
                backgroundSize: '100% 120px',
                animation: 'sideScroll 1s linear infinite', // Faster scroll for closer elements
                zIndex: 0,
              }}
            ></div>
      
            {/* Right Barrier */}
            <div 
              className="absolute right-0 top-0 h-full w-10 bg-gray-700" 
              style={{
                borderLeft: '2px solid #555',
                backgroundImage: `repeating-linear-gradient(to bottom, #888 0px, #888 10px, transparent 10px, transparent 20px)`,
                backgroundSize: '100% 120px',
                animation: 'sideScroll 1s linear infinite', // Faster scroll for closer elements
                zIndex: 0,
              }}
            ></div>
      
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
            borderRadius: '15px 15px 5px 5px / 30px 30px 5px 5px', // More defined bike shape
            boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.3), 0 0 15px rgba(0,0,255,0.7)', // Inner shadow and outer glow
            border: '2px solid #33f', // Blue border
            position: 'absolute',
            zIndex: 1,
          }}
        >
          {/* Headlight */}
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '4px',
            backgroundColor: 'yellow',
            borderRadius: '2px',
            boxShadow: '0 0 5px yellow',
          }}></div>
          {/* Seat/Rear */}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '8px',
            backgroundColor: '#333',
            borderRadius: '4px 4px 2px 2px',
          }}></div>
        </div>
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
            borderRadius: '15px 15px 5px 5px / 30px 30px 5px 5px', // More defined bike shape
            boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.3), 0 0 12px rgba(255,0,0,0.6)', // Inner shadow and red glow
            border: '2px solid #f33', // Red border
            position: 'absolute',
            zIndex: 1,
          }}
        >
          {/* Headlight */}
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '8px',
            height: '4px',
            backgroundColor: 'orange',
            borderRadius: '2px',
            boxShadow: '0 0 5px orange',
          }}></div>
          {/* Seat/Rear */}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '8px',
            backgroundColor: '#444',
            borderRadius: '4px 4px 2px 2px',
          }}></div>
        </div>
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