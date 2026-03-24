import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 80;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood(newSnake));
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, generateFood, score, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused((p) => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, Math.max(50, INITIAL_SPEED - score));
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused, score]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-gray-900/50 rounded-2xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,243,255,0.2)] backdrop-blur-sm">
      <div 
        className="absolute top-4 left-4 text-cyan-400 font-digital text-4xl tracking-widest drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] glitch-text"
        data-text={`SCORE: ${score}`}
      >
        SCORE: {score}
      </div>
      
      <div 
        className="grid bg-black/80 border-2 border-cyan-500/50 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.3)] mt-12"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
          const isSnakeHead = snakeIndex === 0;
          const isSnakeBody = snakeIndex > 0;
          const isFood = food.x === x && food.y === y;

          let inlineStyle = {};
          if (isSnakeBody) {
            const opacity = Math.max(0.1, 1 - (snakeIndex / snake.length));
            inlineStyle = {
              backgroundColor: `rgba(0, 243, 255, ${opacity * 0.8})`,
              boxShadow: `0 0 ${10 * opacity}px rgba(0, 243, 255, ${opacity})`
            };
          }

          return (
            <div
              key={i}
              style={inlineStyle}
              className={`
                w-full h-full border-[0.5px] border-cyan-900/20
                ${isSnakeHead ? 'bg-cyan-400 shadow-[0_0_15px_#00f3ff] z-10 rounded-sm' : ''}
                ${isSnakeBody ? 'rounded-sm' : ''}
                ${isFood ? 'bg-fuchsia-500 shadow-[0_0_12px_#ff00ff] rounded-full scale-75' : ''}
              `}
            />
          );
        })}
      </div>

      {/* Overlays */}
      {(gameOver || isPaused) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl z-20">
          <h2 className={`text-4xl font-black mb-6 tracking-widest ${gameOver ? 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]'}`}>
            {gameOver ? 'GAME OVER' : 'PAUSED'}
          </h2>
          
          <button
            onClick={gameOver ? resetGame : () => setIsPaused(false)}
            className="group relative p-5 bg-black/40 rounded-full border-2 border-cyan-400 text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black shadow-[0_0_20px_rgba(0,243,255,0.6)] hover:shadow-[0_0_40px_rgba(0,243,255,1)] flex items-center justify-center"
            title={gameOver ? 'Restart' : 'Resume'}
          >
            {gameOver ? (
              <RotateCcw size={40} className="drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] group-hover:drop-shadow-none" />
            ) : (
              <Play size={40} className="drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] group-hover:drop-shadow-none ml-2" />
            )}
          </button>
          
          <p className="mt-6 text-gray-400 font-mono text-sm">
            Press <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-cyan-300">SPACE</kbd> to {gameOver ? 'restart' : 'resume'}
          </p>
        </div>
      )}
    </div>
  );
}
